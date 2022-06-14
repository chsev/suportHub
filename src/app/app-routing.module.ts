import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome/welcome.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { CompanyRoutingModule } from './company/company-routing.module';
import { TeamRoutingModule } from './team/team-routing.module';
import { SystemRoutingModule } from './system/system-routing.module';
import { UserRoutingModule } from './user/user-routing.module';
import { AccountRoutingModule } from './account/account-routing.module';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: {role: 'ADMIN,GERENTE,FUNC'}}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    CompanyRoutingModule,
    TeamRoutingModule,
    SystemRoutingModule,
    UserRoutingModule,
    AccountRoutingModule
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
