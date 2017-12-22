import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Room } from './room';
// import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'pm-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  rooms : any = null;
  roomForm : FormGroup;
  newRoom : boolean = false;
  roomMessage : string;

  private validationMessages = {
    required : 'Enter the name of a room.',
    pattern : 'Enter a valid room name.'
  }

  constructor(private _tokenService : TokenService, private _requestService : RequestService, private fb : FormBuilder) {
    this._requestService.context = this;
  }

  ngOnInit() : void {
    this._requestService.callRooms();
    /*this.roomForm = new FormGroup({ // inputs
      name: this.name
    });*/
    //w/ formBuilder
    this.roomForm = this.fb.group({
      name : ["", [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]]
    });
    this.onChanges();
  }

  onChanges() : void{
    this.roomForm.get('name').valueChanges.subscribe( val => { // .debounceTime(500)
      this.newRoom = true;
      this.rooms.forEach(room => {
          if(room.name == val){
              this.newRoom = false; 
          }
      });

      this.setValidationMessage(this.roomForm.get('name'));
    })
  }

  setValidationMessage(c: AbstractControl): void{
    this.roomMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.roomMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
    }
  }

  submit(submitCase) : void{
    if(this.roomForm.get('name').value != ''){
      switch(submitCase){
        case 'new' : 
            let dataToAdd = new FormData();
            dataToAdd.append("name", this.roomForm.get('name').value);
            this._requestService.addRoom(dataToAdd);
          break;
        case 'remove' :
            this._requestService.removeRoom(this.roomForm.get('name').value);
          break;
      }
    }
  }
}
