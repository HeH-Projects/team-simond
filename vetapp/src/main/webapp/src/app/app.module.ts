import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { TokenService } from './service/token.service'

import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component'
import { ListingModule } from './listing/listing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppointmentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
        { path: 'home', component: AppointmentComponent },
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: 'login', pathMatch: 'full'},
        { path: '**', redirectTo: 'login', pathMatch: 'full'}
    ]),
    ListingModule,
    HttpModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
  providers:[
    TokenService
  ]
})
export class AppModule { }
