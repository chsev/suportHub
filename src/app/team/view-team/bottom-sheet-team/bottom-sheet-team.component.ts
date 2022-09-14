import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-bottom-sheet-team',
  templateUrl: './bottom-sheet-team.component.html',

})
export class BottomSheetTeamComponent  {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public passedData: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetTeamComponent>,
    private teamService: TeamService
  ) { }


  removeMember( ): void {
    this.teamService.removeMember(this.passedData.companyId, this.passedData.teamId, this.passedData.profile.id);
    this.dismiss();

  }

  makeAdmin( ): void {
    this.teamService.addAdmin(this.passedData.companyId, this.passedData.teamId, this.passedData.profile.id);
    this.dismiss();
  }

  removeAdmin( ){
    if( this.self() ){
      this.teamService.removeAdmin(this.passedData.companyId, this.passedData.teamId, this.passedData.profile.id);
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
