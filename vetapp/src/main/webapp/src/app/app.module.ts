import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component'
import { ListingModule } from './listing/listing.module';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
        { path: 'home', component: AppointmentComponent },
        { path: '', redirectTo: 'home', pathMatch: 'full'},
        { path: '**', redirectTo: 'home', pathMatch: 'full'}
    ]),
    ListingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
