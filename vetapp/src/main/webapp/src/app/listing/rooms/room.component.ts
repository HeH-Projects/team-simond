import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../service/request.service';
import {FormControl, Validators, AbstractControl} from '@angular/forms';
import {Room} from "../../models/room";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import 'rxjs/add/operator/distinctUntilChanged';
import {Doctor} from "../../models/doctor";

@Component({
  selector: 'pm-room',
  templateUrl: './room.component.html',
  styleUrls: ['./../../bootstrap/reset.css', './room.component.css']
})
export class RoomComponent implements OnInit {

  newRoom : boolean = true;
  roomMessage : string;
  rooms: Room[];
  roomsSearchList: Observable<Room[]>;
  searchField: FormControl;

  private validationMessages = {
      required : "Veuillez entrer le nom d'une salle.",
      pattern : "Veuillez entrer un nom de salle correct."
  };

  constructor(private _requestService : RequestService) { }

  private searchRooms(term: string): Observable<Room[]> {
     let roomsList: Room[] = new Array();

     if (!term.trim()) {
         return Observable.of(roomsList);
     }

     this.newRoom = true;

     this.rooms.forEach(room => {
        if(room.name.toLowerCase().indexOf(term.toLowerCase()) != -1){
            roomsList.push(room);
        }

        if(room.name == term){
            this.newRoom = false;
            (document.getElementById("color") as HTMLInputElement).value = room.color;
        }
     });

    return Observable.of(roomsList);
  }

  ngOnInit() : void {
     this._requestService.getRooms().subscribe(rooms => {
         rooms.forEach(room => {
             room['color'] = room['color'].replace(/"/g, '');
             room['color'] = "#" + room['color'];
         });
         this.rooms = rooms.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);});
     });

     this.searchField = new FormControl("", [Validators.required, Validators.pattern(/^\S[A-Za-z0-9\s]+\S$/)]);
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
                 let roomToAdd = new FormData();
                 roomToAdd.append("name", this.searchField.value);
                 roomToAdd.append("color", (document.getElementById("color") as HTMLInputElement).value.replace(/#/g, '').toUpperCase());
                 this._requestService.addRoom(roomToAdd).subscribe(room => {
                    this.rooms.push(room);
                    this.newRoom = false;
                 });
               break;
            case 'modify' :
                let roomToChange = new FormData();
                roomToChange.append("name", this.searchField.value);
                roomToChange.append("color", (document.getElementById("color") as HTMLInputElement).value.replace(/#/g, '').toUpperCase());
                this._requestService.modifyRoom(this.searchField.value, roomToChange).subscribe(room => {
                    this.rooms.forEach( (roomInList: Room) => {
                        //Une méthode 'isEqualTo' dans le modèle 'Doctor' aurait été plus appropriée mais je n'ai pas réussi
                        if(roomInList.id == room.id && roomInList.name == room.name){
                            this.rooms.splice(this.rooms.indexOf(roomInList), 1, room);
                        }
                    });
                });
                break;
            case 'remove' :
               if(!this.newRoom){
                   this._requestService.removeRoom(this.searchField.value).subscribe((room: Room) => {
                       this.rooms.forEach( (roomInList: Room) => {
                           //Une méthode 'isEqualTo' dans le modèle 'Room' aurait été plus appropriée mais je n'ai pas réussi
                           if(roomInList.id == room.id && roomInList.name == room.name){
                               this.rooms.splice(this.rooms.indexOf(roomInList), 1);
                               this.newRoom = true;
                           }
                       });
                   });
               }
               break;
        }
     }
  }
}
