import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  isLoading = false;
  private loadingSubscription!: Subscription; 

  constructor(
    private authService: AuthService, 
    private uiService: UiService
  ) { }


  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

      this.signupForm = new FormGroup({
        name: new FormControl('', {validators: [Validators.required]}),
        email: new FormControl('', {validators: [Validators.required, Validators.email]}),
        password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)]}),
        position: new FormControl(''),
        terms: new FormControl(false, {validators: [Validators.required]})
      })
  }


  onSubmit( ): void {
    this.authService.registerUser({
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      position: this.signupForm.value.position
    })
  }

  
  ngOnDestroy(): void {
      this.loadingSubscription.unsubscribe();
  }

}
