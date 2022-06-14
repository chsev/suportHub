import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'suporteHub';

  constructor(
    // private router: Router,
    private authService: AuthService,
    // private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.authService.initAuthListener();
    // if(this.authService.isAuth()){

  }

}
