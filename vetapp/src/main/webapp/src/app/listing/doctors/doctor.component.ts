import { Component } from '@angular/core';
import { TokenService } from '../../service/token.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Http, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { NgModel } from '@angular/forms'
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { RequestService } from '../../service/request.service';

@Component({
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit{
    
    doctors : any = null;
    rooms : any = null;
    roomNames : any = [];
    form_name : string = null;
    form_room : string = null;
    form : NgForm;
    newUser : boolean = true;
    selectedDoctor : any = null;

    openingHour = 8;
    closingHour = 17;

    days : string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    timeSlots : object = { monday : [], tuesday : [], wednesday : [], thursday : [], friday : [], saturday: [], sunday : [] }; 

    constructor(private _tokenService : TokenService, private _http : Http, private _requestService : RequestService){
        this._requestService.context = this;
    }

    ngOnInit(){
        this._requestService.callDoctors();
        this._requestService.callRooms();
    }

    range(start : number, end : number){
        let input = new Array();
    
        for (var i=start; i<=end; i++) {
            input.push(i);
        }
    
        return input;
    }

    isNewUser() {
        this.newUser = true;
        this.doctors.forEach(doctor => {
            console.log(doctor.name+' - '+this.form_name);
            if(doctor.name == this.form_name){
                console.log('match found');
                this.newUser = false; 
                this.selectedDoctor = doctor;
                for(let j = 0; j < 7; j++){
                    let x = parseInt(doctor[this.days[j]], 16);
                    for(let i = 0; i<24; i++){
                        this.timeSlots[this.days[j]][i] = x >> (23-i) & 1;
                    }
                }
                this.selectOptionByValue(document.getElementById("rooms"), doctor.roomId);
            }
        });
        if(this.newUser){
            for(let i = 0; i < 7; i++){
                this.timeSlots[this.days[i]] = [];
            }
        }
        console.log(this.newUser);
    }

    selectOptionByValue(sObj, value) {
        var i;
        for (i = 0; i < sObj.options.length; i++) {
            if (sObj.options[i].value == value) {
                sObj.options.selectedIndex = i;
                break;
            }
        }
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
