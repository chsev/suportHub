import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  isLoading = false;
  private loadingSubs!: Subscription;
  hide = true;


  constructor(
    private authService: AuthService,
    private uiService: UiService
    ) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading);
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', {validators: [Validators.required, Validators.email]}),
      password: new UntypedFormControl('', {validators: [Validators.required]}),
    })
  }

  onSubmit(){
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    })
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }
}


