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
    form_name : string = null;
    form_room : string = null;
    form : NgForm;
    newUser : boolean = true;

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
            }
        });
        console.log(this.newUser);
    }

    submit(form : NgForm, submitCase){
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
