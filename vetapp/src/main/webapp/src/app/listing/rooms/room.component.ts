import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'pm-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  rooms : any = null;
  form : any = null;
  form_rooms : any = null;
  newRoom : boolean = false;

  constructor(private _tokenService : TokenService, private _requestService : RequestService) {
    this._requestService.context = this;
  }

  ngOnInit() {
    this._requestService.callRooms();
  }

  isNewRoom() {
    this.newRoom = true;
    this.rooms.forEach(room => {
        //console.log(room.name+' - '+this.form_rooms);
        if(room.name == this.form_rooms){
            //console.log('match found');
            this.newRoom = false; 
        }
    });
    //console.log(this.newRoom);
}

  submit(form : NgForm, submitCase : string){
    this.form = form;
    switch(submitCase){
        case "modify" :
                break;
        case "remove" :
                break;
        case "new" :
                break;
        default : 
                break;
    }
}
}
