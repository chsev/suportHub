import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { CompanyService } from "../../services/company.service";


@Component({
  selector: 'bottom-sheet-members-options',
  templateUrl: 'bottom-sheet-members-options.html',
})
export class BottomSheetOverviewMembersOptions {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public passedData: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewMembersOptions>,
    private companyService: CompanyService
  ) { }

  removeMember(event: MouseEvent): void {
    this.companyService.removeMember(this.passedData.companyId, this.passedData.profile.id);
    this.dismiss();
    // event.preventDefault();
  }

  makeAdmin(event: MouseEvent): void {
    this.companyService.addAdmin(this.passedData.companyId, this.passedData.profile.id);
    this.dismiss();
    // event.preventDefault();
  }

  removeAdmin(event: MouseEvent){
    if( this.self() ){
      this.companyService.removeAdmin(this.passedData.companyId, this.passedData.profile.id);
    }
    this.dismiss();
  }

  self(): boolean{
    return this.passedData.profile.id == this.passedData.curUser.id;
  }

  dismiss(){
    this._bottomSheetRef.dismiss();
  }
}