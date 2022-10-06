import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { WelcomeComponent } from './welcome/welcome/welcome.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { CompanyRoutingModule } from './company/company-routing.module';
import { TeamRoutingModule } from './team/team-routing.module';
import { SystemRoutingModule } from './system/system-routing.module';
import { AccountRoutingModule } from './account/account-routing.module';
import { PostRoutingModule } from './post/post-routing.module';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent, },
  { path: '**', redirectTo: 'welcome'},

];

@NgModule({
  imports: [
    AuthRoutingModule,
    CompanyRoutingModule,
    TeamRoutingModule,
    SystemRoutingModule,
    AccountRoutingModule,
    PostRoutingModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
