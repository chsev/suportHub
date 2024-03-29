import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { WelcomeModule } from './welcome/welcome.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { NavigationModule } from './navigation/navigation.module';
import { CompanyModule } from './company/company.module';
import { TeamModule } from './team/team.module';
import { SystemModule } from './system/system.module';
import { PostModule } from './post/post.module';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    CompanyModule,
    TeamModule,
    SystemModule,
    WelcomeModule,
    AuthModule,
    NavigationModule,
    AccountModule,
    PostModule,
    AngularFireModule.initializeApp(environment.firebase),
    QuillModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
