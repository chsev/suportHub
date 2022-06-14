import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
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
  currentUser: User | undefined;
  // currentUID: string | undefined;
  private userDataChangedSub!: Subscription;
  private loadingSub!: Subscription;
  isLoading = false;

  accountForm: FormGroup = new FormGroup({
    email: new FormControl({ value: ''}),
    position: new FormControl({ value: '' }),
    company: new FormControl({ value: '' })
  })

  constructor(
    private accountService: AccountService,
    private uiService: UiService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe(
        (user: User) => {
          this.currentUser = user;

          //debug
          console.log("user retornou:");
          console.log(this.currentUser);

          this.accountForm.setValue({
            email: user.email,
            position: user.position ? user.position : "você não definiu um cargo",
            company: user.company ? user.company : "você não se juntou a um grupo de empresa ainda"
          });

          this.accountForm.controls['email'].setValue(user.email);
          this.evalPosition(this.currentUser.position);

          this.evalCompany(user);
        }
      )

    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);


    this.accountService.fetchUserData(); 

    // if (!this.currentUID) {
    //   this.authService.getUserID()
    //     .then((uid) => {
    //       this.currentUID = uid;
    //       if (this.currentUID) {
    //         this.accountService.fetchUserData(this.currentUID);
    //       }
    //     }
    //     )
    // }
  }


  private evalCompany(user: User) {
    if (!user.company) {
      this.accountForm.controls['company'].disable();
    }
  }

  evalPosition(position: string | undefined) {
    if (!position) {
      this.accountForm.controls['position'].setValue("você não definiu um cargo");
      this.accountForm.controls['position'].disable();
    }
    else {
      this.accountForm.controls['position'].setValue(position);
      this.accountForm.controls['position'].enable();
    }
  }


  ngOnDestroy(): void {
    this.userDataChangedSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }


  openResetPasswordDialog() {
    const dialogRef: MatDialogRef<ConfirmResetComponent> = this.dialog.open(ConfirmResetComponent, {
      data: { email: this.currentUser?.email }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Redefinindo senha...");
        this.authService.sendPasswordResetEmail(this.currentUser?.email!);
      }
    })
  }


  openEditPositionDialog() {
    const dialogRef: MatDialogRef<EditPositionComponent> = this.dialog.open(EditPositionComponent, {
      data: { position: this.currentUser?.position }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log("Alterando cargo...");
        // console.log(result);
        // console.log(this.currentUser);
        if (this.currentUser) {
          // console.log("terminei cargo...");
          this.currentUser.position = result;
          this.evalPosition(this.currentUser.position);
          this.accountService.updateUserPosition(result.toString());
          // console.log("terminei cargo...");
        }
      }
    })
  }


  onLogout() {
    this.authService.logout();
  }

}
