import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: UntypedFormGroup;
  isLoading = false;
  private loadingSubscription!: Subscription;
  hide = true;

  constructor(
    private authService: AuthService,
    private uiService: UiService
  ) { }


  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.signupForm = new UntypedFormGroup({
      name: new UntypedFormControl('', { validators: [Validators.required] }),
      email: new UntypedFormControl('', { validators: [Validators.required, Validators.email] }),
      password: new UntypedFormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
      position: new UntypedFormControl(''),
      terms: new UntypedFormControl(false, { validators: [Validators.required] })
    })
  }


  onSubmit(): void {
    this.authService.registerUser(
      {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      },
      {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        position: this.signupForm.value.position
      })
  }


  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

}
