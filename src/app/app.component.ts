import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { LoginService } from './auth/services/login.service';
import { Usuario } from './shared/models/usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'suporteHub';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.initAuthListener();
  }

  get usuarioLogado(): Usuario | null {
    return this.loginService.usuarioLogado;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
