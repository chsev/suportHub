import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CompanyService } from 'src/app/company/services/company.service';
import { Company } from 'src/app/shared/models/company.model';
import { User } from 'src/app/shared/models/user.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { AccountService } from '../services/account.service';
import { ConfirmResetComponent } from './confirm-reset/confirm-reset.component';
import { EditPositionComponent } from './edit-position/edit-position.component';


@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.css']
})
export class ListAccountComponent implements OnInit {
  avatarSrc: String = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  user: User | undefined;
  company: Company | undefined;
  private userDataChangedSub!: Subscription;
  private companyDataSub!: Subscription;
  private loadingSub!: Subscription;
  isLoading = false;

  accountForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl({ value: '' }),
    position: new UntypedFormControl({ value: '' }),
    company: new UntypedFormControl({ value: '' })
  })

  constructor(
    private accountService: AccountService,
    private companyService: CompanyService,
    private uiService: UiService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe(
        (userData: User) => {
          this.user = userData;
          this.accountForm.controls['email'].setValue(this.user.email);
          this.evalPosition(this.user);
          this.evalCompany(this.user);
        }
      )

    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.accountService.fetchUserData();
  }


  private evalCompany(user: User) {
    if (!user.companyId) {
      this.accountForm.controls['company'].setValue("você não se juntou a um grupo de empresa ainda");
      this.accountForm.controls['company'].disable();
    }
    else {
      this.fetchCompanyData(user.companyId);
    }
  }

  evalPosition(user: User) {
    if (!user.position) {
      this.accountForm.controls['position'].setValue("você não definiu um cargo");
      this.accountForm.controls['position'].disable();
    }
    else {
      this.accountForm.controls['position'].setValue(user.position);
      this.accountForm.controls['position'].enable();
    }
  }


  private fetchCompanyData(companyID: string) {
    this.companyDataSub = this.companyService.fetchCompanyDoc(companyID)
      .subscribe((companyData) => {
        if (companyData) {
          this.company = companyData;
          this.accountForm.controls['company'].setValue(this.company.name);
          this.accountForm.controls['company'].enable();
        }
      });
  }


  ngOnDestroy(): void {
    this.userDataChangedSub.unsubscribe();
    this.loadingSub.unsubscribe();
    if(this.companyDataSub)
      this.companyDataSub.unsubscribe();
  }


  openResetPasswordDialog() {
    const dialogRef: MatDialogRef<ConfirmResetComponent> = this.dialog.open(ConfirmResetComponent, {
      data: { email: this.user?.email }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Redefinindo senha...");
        this.authService.sendPasswordResetEmail(this.user?.email!);
      }
    })
  }


  openEditPositionDialog() {
    const dialogRef: MatDialogRef<EditPositionComponent> = this.dialog.open(EditPositionComponent, {
      data: { position: this.user?.position }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && this.user) {
        console.log("Alterando cargo...");
        // this.currentUser.position = result;
        // this.evalPosition(this.currentUser);
        this.accountService.updateUserPosition(result.toString());
        // this.accountService.fetchUserData(); //?
      }
    })
  }


  onLogout() {
    this.authService.logout();
  }

}
