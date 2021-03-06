import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId!: string | null;
  user!: any;
  userForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', {validators: [Validators.required, Validators.email]}),
    name: new UntypedFormControl('', { validators: [Validators.required] }),
    position: new UntypedFormControl(''),
    uid: new UntypedFormControl({value: '', disabled: true})
  })

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.userService.editingUserId;

    if (!this.userId) {
      this.onCancelOrExit();
    } else {
      this.userService.editingUserChanged
        .subscribe(payload => {
          this.user = payload as User;
          this.userForm.setValue({
            email: payload.email,
            name: payload.name,
            position: payload.position,
            // uid: payload.uid
          })
        }
        );
      this.userService.searchById(this.userId)
    }
  }


  onSubmit() {
    this.userService.update({ id: this.userId, ...this.userForm.value });
    this.router.navigate(["user/list"]);
  }


  onCancelOrExit() {
    this.router.navigate(["user/list"]);
  }


}
