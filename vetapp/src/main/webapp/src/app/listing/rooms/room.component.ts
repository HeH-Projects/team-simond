import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import {FormControl, Validators, AbstractControl} from '@angular/forms';
import {Room} from "../../models/room";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'pm-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  newRoom : boolean = true;
  roomMessage : string;
  rooms: Room[];
  roomsSearchList: Observable<Room[]>;
  searchField: FormControl;

  private validationMessages = {
    required : 'Enter the name of a room.',
    pattern : 'Enter a valid room name.'
  };

  constructor(private _tokenService : TokenService, private _requestService : RequestService) { }

  private searchRooms(term: string): Observable<Room[]> {
     let roomsList: Room[] = new Array();

     if (!term.trim()) {
         return Observable.of(roomsList);
     }

     this.newRoom = true;

     this.rooms.forEach(room => {
        if(room.name.indexOf(term) != -1){
            roomsList.push(room);
        }

        if(room.name == term){
            this.newRoom = false;
        }
     });

    return Observable.of(roomsList);
  }

  ngOnInit() : void {
     this._requestService.getRooms().subscribe(rooms => this.rooms = rooms);

     this.searchField = new FormControl("", [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]);
     this.searchField.valueChanges.distinctUntilChanged().subscribe( val => {
        this.roomsSearchList = this.searchRooms(val);

        this.setValidationMessage(this.searchField);
     });
  }

  setValidationMessage(c: AbstractControl): void{
     this.roomMessage = '';
     if((c.touched || c.dirty) && c.errors){
        this.roomMessage = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
     }
  }

  submit(submitCase) : void{
     if(this.searchField.value.trim()){
        switch(submitCase){
            case 'new' :
                 let dataToAdd = new FormData();
                 dataToAdd.append("name", this.searchField.value);
                 this._requestService.addRoom(dataToAdd).subscribe(room => {
                    this.rooms.push(room);
                    this.newRoom = false;
                 });
               break;
            case 'remove' :
               this._requestService.removeRoom(this.searchField.value).subscribe((room: Room) => {
                  this.rooms.forEach( (roomInList: Room) => {
                     //Une méthode 'isEqualTo' dans le modèle 'Room' aurait été plus appropriée mais je n'ai pas réussi
                     if(roomInList.id == room.id && roomInList.name == room.name){
                        this.rooms.splice(this.rooms.indexOf(roomInList), 1);
                        this.newRoom = true;
                     }
                  });
               });
               break;
        }
     }
  }
}
