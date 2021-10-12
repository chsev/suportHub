import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/shared/models/login.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('formLogin') formLogin!: NgForm;
  login!: Login;
  loading: boolean = false;
  message!: string;


  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    if (this.loginService.usuarioLogado){
      this.router.navigate( ["/home"]);
    }
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {this.message = params['error'];
      })
    this.login = new Login;
  }

  logar(): void {
    this.loading = true;
    if (this.formLogin.form.valid) {
      this.loginService.login(this.login).subscribe((usu) => {
        this.loginService.usuarioLogado = usu!;
        this.loading = false;
        this.router.navigate( ["/home"] );
      });
    }
  }

}
