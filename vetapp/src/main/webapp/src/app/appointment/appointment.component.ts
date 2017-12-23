import { Component, OnInit, IterableDiffers } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NgStyle } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { TokenService } from '../service/token.service';
import { DoctorIdPipe } from './doctorid.component';
import { RequestService } from '../service/request.service';

@Component({
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit{
    apisrv : string = "http://localhost:8080";
    openingHour : number = 8;
    closingHour : number = 18;
    date = new Date();
    //date = new Date(2017,0,1);
    weekView : boolean;
    
    appointmentDurations = [.5,.75,1];
    roomColors : Array<any> = null;
    
    days : any = [];
    doctors : any = [];
    rooms : any = [];
    roomNames : any = [];
    customers : any = [];
    patients : any = [];
    types : any = [{id:1, name:"Visite"},{id:2, name:"Toilettage"},{id:3, name:"Pédicure"}];

    token : any = null;

    popup : any = null;
    form : any = null;
    form_doctor :string;
    form_customer :string;
    form_patient :string;
    form_room :string;
    form_exam :string;
    iterableDiffer : any = null;

    selectedPatientId : number = null;

    updateAppointement : boolean = false;

    constructor(private _http: Http, private _tokenService : TokenService, private _iterableDiffers: IterableDiffers, private _requestService : RequestService){
        this._requestService.context = this;
        this.iterableDiffer = this._iterableDiffers.find([]).create(null);
        this.roomColors = [["#E57373","#D32F2F"],["#64B5F6","#1976D2"],["#AED581","#689F38"]];
        this._requestService.callRooms();
        this._requestService.callDoctors();
        this.update();
    }
    ngOnInit() {
        this.token = this._tokenService.getMyToken();
    }

    range(total){
        let input = new Array();
        total = parseInt(total);
    
        for (var i=0; i<total; i++) {
            input.push(i);
        }
    
        return input;
    }

    yyyy_mm_dd(date, h = false, joinChar = "-") {
        return [date.getFullYear(),
                 ("0" + (date.getMonth() + 1)).slice(-2),
                 ("0" + date.getDate()).slice(-2)].join(joinChar) + 
                 (h ? "T"+
                     ("0" + date.getHours()).slice(-2) + ":" +
                     ("0" + date.getMinutes()).slice(-2)
                     : "");
    };

    dateToTitle(date) {
        return ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][date.getDay()] + " " + date.getDate();
    };
    inSlot(doctor, day, hour) {
        return ("000000000000000000000000" + parseInt(doctor[["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][day.date.getDay()]], 16).toString(2)).slice(-24)[hour] == '1';
    }
    stringToDate(str) {
        let d =  new Date(str);
		d.setTime(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));
		return d;
    }
    today() {
        this.date = new Date();
        this.update();
    }
    changeDate(add) {
        this.date.setDate(this.date.getDate() + ((add ? 1 : -1) * (this.weekView ? 7 : 1)));
        this.update();
    }
    update() {
        //console.log(this.weekView);
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
            this._http.get("/api/json/appointments/" + this.yyyy_mm_dd(date) , this._tokenService.getMyToken())
            .map((res: Response) => res.json())
            .subscribe(function(date, appointments){
				let i, hf_duplicate = false;
				for (i = 0; i < this.days.length; i++) {
					if (this.days[i].date.getTime() == date.getTime()) {
						hf_duplicate = true;
					}
				}
				if (!hf_duplicate) {
					this.days.push({date: date, appointments: appointments.appointments, isToday: date.toDateString() === (new Date()).toDateString() });
					this.days.sort((a:any, b:any) => a.date - b.date);
				}
            }.bind(this, date));
            date = new Date(date);
            date.setDate(date.getDate() + 1);
        }
    }

    changeView(){
        this.weekView = !this.weekView;
        this.update();
    }

    createAppointment(doctor, day, hour, x) {
        this.popup = document.querySelector('.vetCal-popup');
        this.form = document.querySelector('#vetCal-appointment-form');
        this.updateAppointement = false;
        //console.log(this.popup);
        this.popup.style.display = "block";
        var f = this.form,
            d = day.date,
            y = hour + ":" + x*15;
        d.setHours(hour);
        d.setMinutes(x*15);
        f.date.value = this.yyyy_mm_dd(d, true);
        f.getElementsByTagName("h3")[0].innerHTML = this.dateToTitle(d) + " " + y;
        this.selectOptionByValue(f.doctor, doctor.id);
        this.selectedPatientId = null;
        this.form.patient.disabled = false;
        this.form.customer.disabled = false;
        this.form.customer.value = "";
        this.patients = [];
        this.form.room.selectedIndex = -1;
        this.form.type.selectedIndex = -1;
    }
    updateAppointment(appointment) {
        this.popup = document.querySelector('.vetCal-popup');
        this.form = document.querySelector('#vetCal-appointment-form');
        this.popup.style.display = "block";        
        this.updateAppointement = true;
        var f = this.form,
            d = this.stringToDate(appointment.date),
            x = d.getHours() + ":" + d.getMinutes();
        f.date.value = this.yyyy_mm_dd(d, true);
        f.getElementsByTagName("h3")[0].innerHTML = this.dateToTitle(d) + " " + x;
        this.selectOptionByValue(f.doctor, appointment.doctorId);
        this.selectOptionByValue(f.room, appointment.roomId);
        this.selectOptionByValue(f.type, appointment.type);
        this.selectedPatientId = appointment.patientId;
        
        this._requestService.findCustomerByPatientId(appointment.patientId);
        
        this.form.patient.disabled = true;
        this.form.customer.disabled = true;
    }
    removeAppointment(){
        this._requestService.removeAppointement(this.form.date.value, this.form.patient.value)
    }
    selectOptionByValue(sObj, value) {
        for (let i = 0; i < sObj.options.length; i++) {
            if (sObj.options[i].value == value) {
                sObj.options.selectedIndex = i;
                break;
            }
        }
    }
    onCustomerChange() {
        //console.log('customer change');
        var f = this.form,
            tmp = f.customer.value.split("#");
        if (tmp.length == 2 && this.patients.length == 0) {
            this._requestService.findPatientsByCustomerId(parseInt(tmp[1]));
        } else {
            if(f.customer.value.length >= 1){
                this._requestService.findCustomersByIncompleteName(f.customer.value);
            }
            this.patients = [];
        }
    }

    ngAfterViewChecked(){
        let f = this.form;
        
        if(this.patients.length >0){
            if (this.selectedPatientId !== null) { // updateAppointment
                this.selectOptionByValue(f.patient, this.selectedPatientId);
            } 
        }
        if(this.updateAppointement && this.customers.length == 1){
            f.customer.value = this.customers[0].name + " #" + this.customers[0].id;
            this.onCustomerChange();
        }
    }
    
    submit(){
        let form = this.form;
        let data = new FormData();
        data.append("room_id", form.room.value);
        data.append("type", form.type.value); 
        if(this.updateAppointement){
            this._requestService.modifyAppointment(form.date.value, form.patient.value, data);
        }else{
            data.append("patient_id", form.patient.value);
            data.append("doctor_id", form.doctor.value);
            data.append("date", form.date.value);
            //console.log(form.date);
            //console.log(form.date.value);
            this._requestService.addAppointment(data);
        }
    }

    setCustomers(customers){
        this.customers = customers;
    }
    setPatients(patients){
        this.patients = patients;
    }

    refresh(){
        this.popup.style.display = "none";
        this.update();
    }
}

