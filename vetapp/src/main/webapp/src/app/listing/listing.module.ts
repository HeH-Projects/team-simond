import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component'
import { DoctorComponent } from './doctors/doctor.component';
import { RoomComponent } from './rooms/room.component';
import { ClientComponent } from './clients/client.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        { path: 'users', component: UsersComponent },
        { path: 'users/doctors', component: DoctorComponent },
        { path: 'users/clients', component: ClientComponent },
        { path: 'users/rooms', component: RoomComponent },
    ])
  ],
  declarations: [
      UsersComponent,
      DoctorComponent,
      ClientComponent,
      RoomComponent
  ],
  providers: [
  ]
})
export class ListingModule { }
