import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DoctorComponent } from './doctors/doctor.component';
import { ClientComponent } from './clients/client.component';
import { RoomComponent } from './rooms/room.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        { path: 'doctors', component: DoctorComponent },
        { path: 'clients', component: ClientComponent },
        { path: 'rooms', component: RoomComponent }
    ])
  ],
  declarations: [
      DoctorComponent,
      ClientComponent,
      RoomComponent
  ],
  providers: [
  ]
})
export class ListingModule { }
