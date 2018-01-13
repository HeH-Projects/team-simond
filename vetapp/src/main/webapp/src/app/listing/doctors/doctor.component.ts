import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { RequestService } from '../../service/request.service';
import {Room} from "../../models/room";
import {Observable} from "rxjs/Observable";
import {Doctor} from "../../models/doctor";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'pm-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./../../bootstrap/reset.css', './doctor.component.css']
})
export class DoctorComponent implements OnInit{

    newDoctor : boolean = true;
    doctors: Doctor[];
    doctorsSearchList: Observable<Doctor[]>;
    searchField: FormControl;
    rooms: Room[];

    openingHour = 8;
    closingHour = 17;

    days : string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    timeSlots : object = { monday : [], tuesday : [], wednesday : [], thursday : [], friday : [], saturday: [], sunday : [] }; 

    constructor(private _requestService : RequestService){ }

    range(start : number, end : number){
        let input = new Array();

        for (var i=start; i<=end; i++) {
            input.push(i);
        }

        return input;
    }

    private selectOptionByValue(sObj, value) {
        var i;
        for (i = 0; i < sObj.options.length; i++) {
            if (sObj.options[i].value == value) {
                sObj.options.selectedIndex = i;
                break;
            }
        }
    }

    private searchDoctors(term: string): Observable<Doctor[]> {
        let doctorsList: Doctor[] = new Array();

        if (!term.trim()) {
            return Observable.of(doctorsList);
        }

        this.newDoctor = true;

        this.doctors.forEach(doctor => {
            if(doctor.name.indexOf(term) != -1){
                doctorsList.push(doctor);
            }

            if(doctor.name == term){
                this.newDoctor = false;

                for(let j = 0; j < 7; j++){
                    let x = parseInt(doctor[this.days[j]], 16);
                    console.log(this.days[j] + " has " + doctor[this.days[j]]);
                    for(let i = 0; i<24; i++){
                        this.timeSlots[this.days[j]][i] = x >> (23-i) & 1;
                    }
                }
                this.selectOptionByValue(document.getElementById("rooms"), doctor.roomId);
            }
        });

        //reset display des jours
        if(this.newDoctor){
            for(let i = 0; i < 7; i++){
                this.timeSlots[this.days[i]] = [];
            }
        }

        return Observable.of(doctorsList);
    }

    private getDoctorByName(name: string): Doctor{
        let answer: Doctor = null;
        this.doctors.forEach(doctor => {
            if(doctor.name == name){
                answer = doctor;
            }
        });
        return answer;
    }

    private binaryToHex(binary: string): string{
        let digitNumber: number = 1;
        let sum: number = 0;
        let hex =  "";
        for(let i = 0; i < binary.length; i++){
            if(digitNumber == 1)
                sum+=parseInt(binary.charAt(i) + "")*8;
            else if(digitNumber == 2)
                sum+=parseInt(binary.charAt(i) + "")*4;
            else if(digitNumber == 3)
                sum+=parseInt(binary.charAt(i) + "")*2;
            else if(digitNumber == 4 || i < binary.length+1){
                sum+=parseInt(binary.charAt(i) + "")*1;
                digitNumber = 0;
                if(sum < 10)
                    hex += sum;
                else if(sum == 10)
                    hex += "A";
                else if(sum == 11)
                    hex += "B";
                else if(sum == 12)
                    hex += "C";
                else if(sum == 13)
                    hex += "D";
                else if(sum == 14)
                    hex += "E";
                else if(sum == 15)
                    hex += "F";
                sum=0;
            }
            digitNumber++;
        }
        return hex;
    }

    ngOnInit(){
        this._requestService.getDoctors().subscribe(doctors => {
            //Fix pour les horaires de travail des médecins #Sample TextPart Backend
            doctors.forEach(doctor => {
                for(let j = 0; j < 7; j++){
                    doctor[this.days[j]] = doctor[this.days[j]].replace(/"/g, '');
                }
            });
            this.doctors = doctors;
        });

        this._requestService.getRooms().subscribe(rooms => this.rooms = rooms);

        this.searchField = new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z]+[\s]{0,1}[A-Za-z]+$/)]);
        this.searchField.valueChanges.distinctUntilChanged().subscribe( val => {
            this.doctorsSearchList = this.searchDoctors(val);
        });
    }

    submit(submitCase) : void{
        if(this.searchField.value.trim()){
            const doctor: Doctor = this.getDoctorByName(this.searchField.value);
            switch(submitCase){
                case 'new' :
                    let docToAdd = new FormData();
                    docToAdd.append("name", this.searchField.value);
                    docToAdd.append("roomId", (document.getElementById("rooms") as HTMLSelectElement).value);

                    for(let j = 0; j < 7; j++){
                        let workingSlots: string = "";
                        for(let i = 0; i < 24; i++){
                            if(this.timeSlots[this.days[j]][i]){
                                workingSlots += "1";
                            }else{
                                workingSlots += "0";
                            }
                        }
                        docToAdd.append(this.days[j], this.binaryToHex(workingSlots));
                    }
                    this._requestService.addDoctor(docToAdd).subscribe((doctor: Doctor) => {
                        //Fix pour les horaires de travail des médecins #Part Backend
                        for(let j = 0; j < 7; j++){
                            doctor[this.days[j]] = doctor[this.days[j]].replace(/"/g, '');
                        }

                        this.doctors.push(doctor);
                        this.newDoctor = false;
                    });
                    break;
                case 'modify' :
                    if(!isNullOrUndefined(doctor)){
                        let docToChange = new FormData();
                        docToChange.append("name", doctor.name);
                        docToChange.append("roomId", (document.getElementById("rooms") as HTMLSelectElement).value);

                        for(let j = 0; j < 7; j++){
                            let workingSlots: string = "";
                            for(let i = 0; i < 24; i++){
                                if(this.timeSlots[this.days[j]][i]){
                                    workingSlots += "1";
                                }else{
                                    workingSlots += "0";
                                }
                            }
                            docToChange.append(this.days[j], this.binaryToHex(workingSlots));
                        }

                        this._requestService.modifyDoctor(doctor.id, docToChange).subscribe((doctor: Doctor) => {
                            //Fix pour les horaires de travail des médecins #Part Backend
                            for(let j = 0; j < 7; j++){
                                doctor[this.days[j]] = doctor[this.days[j]].replace(/"/g, '');
                            }

                            this.doctors.forEach( (doctorInList: Doctor) => {
                                //Une méthode 'isEqualTo' dans le modèle 'Doctor' aurait été plus appropriée mais je n'ai pas réussi
                                if(doctorInList.id == doctor.id && doctorInList.name == doctor.name){
                                    this.doctors.splice(this.doctors.indexOf(doctorInList), 1, doctor);
                                }
                            });
                        });
                    }
                    break;
                case 'remove' :
                    if(!isNullOrUndefined(doctor)){
                        this._requestService.removeDoctor(doctor.id).subscribe((doctor: Doctor) => {
                            this.doctors.forEach( (doctorInList: Doctor) => {
                                //Une méthode 'isEqualTo' dans le modèle 'Doctor' aurait été plus appropriée mais je n'ai pas réussi
                                if(doctorInList.id == doctor.id && doctorInList.name == doctor.name){
                                    this.doctors.splice(this.doctors.indexOf(doctorInList), 1);
                                    this.newDoctor = true;

                                    //reset display des jours
                                    if(this.newDoctor){
                                        for(let i = 0; i < 7; i++){
                                            this.timeSlots[this.days[i]] = [];
                                        }
                                    }
                                }
                            });
                        });
                    }
                    break;
            }
        }
    }
}
