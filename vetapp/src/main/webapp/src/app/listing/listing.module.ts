import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { UsersComponent } from './users/users.component'
import { DoctorComponent } from './doctors/doctor.component';
import { RoomComponent } from './rooms/room.component';
import { ClientComponent } from './clients/client.component';

import { TokenService } from '../service/token.service';
import { RequestService } from '../service/request.service';

@NgModule({
  imports: [
    RouterModule.forChild([
        { path: 'users', component: UsersComponent },
        { path: 'users/doctors', component: DoctorComponent },
        { path: 'users/clients', component: ClientComponent },
        { path: 'users/rooms', component: RoomComponent },
    ]),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  declarations: [
      UsersComponent,
      DoctorComponent,
      ClientComponent,
      RoomComponent
  ],
  providers: [
    TokenService,
    RequestService
  ]
})
export class ListingModule { }
