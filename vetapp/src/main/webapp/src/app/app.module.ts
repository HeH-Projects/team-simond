import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { TokenService } from './service/token.service'
import { MessageService }  from './service/message.service';
import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component'
import { ListingModule } from './listing/listing.module';
import { LoginComponent } from './login/login.component';
import { DoctorIdPipe } from './appointment/doctorid.component';
import {RequestService} from "./service/request.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppointmentComponent,
    DoctorIdPipe
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
    FormsModule
  ],
  bootstrap: [AppComponent],
  providers:[
    TokenService,
    MessageService,
    RequestService
  ]
})
export class AppModule { }
