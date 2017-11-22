import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NgStyle } from '@angular/common'
import { NgModel } from '@angular/forms';
import { TokenService } from '../service/token.service';
import { DoctorIdPipe } from './doctorid.component';

@Component({
    templateUrl: './appointment.component.html'
})
export class AppointmentComponent {
    apisrv : string = "http://localhost:8080";
    openingHour : number = 8;
    closingHour : number = 17;
    //date = new Date();
    date = new Date(2017,0,1);
    weekView : boolean;
    
    appointmentDurations = [.5,.75,1];
    roomColors : Array<any> = null;
    
    days : any = null;
    doctors : any = null;
    rooms : any = null;
    roomNames : any = [];

    token : string = null;

    constructor(private _http: Http, private _tokenService : TokenService){
        this.roomColors = [["#E57373","#D32F2F"],["#64B5F6","#1976D2"],["#AED581","#689F38"]];
        this.token = "/?access_token=" + this._tokenService.getMyToken();
        _http.get(this.apisrv + "/api/json/doctors" + this.token)
            .map((res: Response) => res.json())
            .subscribe(doctors => {
            this.doctors = doctors.doctors;
        });
        _http.get(this.apisrv + "/api/json/rooms" + this.token)
            .map((res: Response) => res.json())
            .subscribe(rooms => {
            var i;
            console.log(rooms);
            this.rooms = rooms.rooms;
            for (i = 0; i < this.rooms.length; i++) {
                this.roomNames[this.rooms[i].id] = this.rooms[i].name;
            }
        });
        this.update();
    }

    range(total){
        let input = new Array();
        total = parseInt(total);
    
        for (var i=0; i<total; i++) {
            input.push(i);
        }
    
        return input;
    }

    yyyy_mm_dd(date, joinChar = "-") {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        return [date.getFullYear(), ("0" + mm).slice(-2), ("0" + dd).slice(-2)].join(joinChar);
    };

    dateToTitle(date) {
        return ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][date.getDay()] + " " + date.getDate();
    };
    inSlot(doctor, day, hour) {
        return ("000000000000000000000000" + parseInt(doctor[["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][day.date.getDay()]], 16).toString(2)).slice(-24)[hour] == '1';
    }
    createAppointment(doctor,day,hour,x) {
        console.log(doctor,day,hour,x);
        alert(doctor.name+" "+this.dateToTitle(day.date)+" "+hour+":"+x*15)
    };
    updateAppointment(appointment) {
        console.log(appointment);
        alert(appointment.date);
    }
    stringToDate(str) {
        return new Date(str);
    }
    today() {
        this.date = new Date();
        this.update();
    }
    changeDate(add) {
        this.date.setDate(this.date.getDate() + ((add ? 1 : -1) * (this.weekView ? 7 : 1)));
        this.update();
    }
    appointments :any;
    update() {
        console.log(this.weekView);
        this.days = [];
        var date = new Date(this.date), nbDays = 1;
        if (this.weekView) {
            nbDays = 7;
            if (date.getDay() === 0) {
                date.setDate(date.getDate() - 6);
            } else {
                date.setDate(date.getDate() - date.getDay() + 1);
            }
        }
        for (var i = 0; i < nbDays; i++) {
            this._http.get(this.apisrv + "/api/json/appointments/" + this.yyyy_mm_dd(date) + this.token)
            .map((res: Response) => res.json())
            .subscribe(function(date, appointments){
                //console.log(date, appointments);
                this.days.push({date: date, appointments: appointments.appointments, isToday: date.toDateString() === (new Date()).toDateString() });
                this.days.sort((a:any, b:any) => a.date - b.date);
            }.bind(this, date));
            date = new Date(date);
            date.setDate(date.getDate() + 1);
        }
    }

    changeView(){
        this.weekView = !this.weekView;
        this.update();
    }
}

