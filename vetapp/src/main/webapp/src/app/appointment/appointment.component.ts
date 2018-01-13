import { Component, OnInit, IterableDiffers } from '@angular/core';
import { RequestService } from '../service/request.service';
import {Room} from "../models/room";
import {Appointment} from "../models/appointment";
import {Patient} from "../models/patient";
import {Customer} from "../models/customer";
import {Observable} from "rxjs/Observable";

@Component({
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit{
    openingHour : number = 8;
    closingHour : number = 18;
    date = new Date();
    weekView : boolean;
    
    appointmentDurations = [.5,.75,1];
    roomColors : Array<any> = null;
    
    days : any = [];
    doctors : any = [];
    rooms : any = [];
    roomNames : any = [];
    customers : any = [];
    types : any = [{id:1, name:"Visite"},{id:2, name:"Toilettage"},{id:3, name:"Pédicure"}];

    popup : any = null;
    form : any = null;
    form_doctor :string;
    form_customer :string;
    form_patient :string;
    form_room :string;
    form_exam :string;
    iterableDiffer : any = null;

    customersSearchList: Observable<Customer[]>;
    currentCustomer: Customer;
    currentPatients: Patient[] = [];
    selectedPatientId : number = null;

    updateAppointement : boolean = false;

    constructor(private _iterableDiffers: IterableDiffers, private _requestService : RequestService){}

    private searchCustomers(term: string): Observable<Customer[]> {
        let customersList: Customer[] = new Array();

        if (!term.trim()) {
            return Observable.of(customersList);
        }

        this.customers.forEach(customer => {
            if(customer.name.indexOf(term) != -1){
                customersList.push(customer);
            }

            if(customer.name == term){
                this.currentCustomer = this.getCustomerByName(term);
                this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
                    this.currentPatients = patients;
                });
            }
        });

        return Observable.of(customersList);
    }

    private getCustomerByName(name: string): Customer{
        let answer: Customer = null;
        for(let i = 0; i < this.customers.length; i++){
            if(this.customers[i].name == name){
                answer = this.customers[i];
                break;
            }
        }
        return answer;
    }

    private getCustomerById(id: number): Customer{
        let answer: Customer = null;
        this.customers.forEach(customer => {
            if(customer.id == id){
                answer = customer;
            }
        });
        return answer;
    }

    updateSearchField(id: number): void{
        this.currentCustomer = this.getCustomerById(id);

        let matchingCustomers: Customer[] = null;
        this.searchCustomers(this.currentCustomer.name).subscribe((customers: Customer[]) => {
                matchingCustomers = customers;
            });
        if(matchingCustomers.length <= 1){
            this.customersSearchList = null;
        }else{
            this.customersSearchList = this.searchCustomers(this.currentCustomer.name);
        }

        this.currentCustomer = this.getCustomerById(id);
        this._requestService.findPatientsByCustomerId(this.currentCustomer.id).subscribe((patients: Patient[]) =>{
            this.currentPatients = patients;
        });

        this.form_customer = this.currentCustomer.name;
    }

    ngOnInit() {
        this.iterableDiffer = this._iterableDiffers.find([]).create(null);
        this.roomColors = [["#E57373","#D32F2F"],["#64B5F6","#1976D2"],["#AED581","#689F38"]];
        this._requestService.getRooms().subscribe((rooms: Room[]) => {
            this.rooms = rooms;
        });
        this._requestService.getDoctors().subscribe(doctors => {
            //Fix pour les horaires de travail des médecins #Sample TextPart Backend
            doctors.forEach(doctor => {
                for(let j = 0; j < 7; j++){
                    doctor[["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][j]] = doctor[["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][j]].replace(/"/g, '');
                }
            });
            this.doctors = doctors;
        });
        this._requestService.getCustomers().subscribe((customers: Customer[]) => {
            this.customers = customers;
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
    today() {
        this.date = new Date();
        this.update();
    }
    changeDate(add) {
        this.date.setDate(this.date.getDate() + ((add ? 1 : -1) * (this.weekView ? 7 : 1)));
        this.update();
    }
    update() {
        this.days = [];
        var date = new Date(this.date), nbDays = 1;
        if (this.weekView) {
            console.log("weekview");
            nbDays = 7;
            if (date.getDay() === 0) {
                date.setDate(date.getDate() - 6);
            } else {
                date.setDate(date.getDate() - date.getDay() + 1);
            }
        }
        for (var i = 0; i < nbDays; i++) {
            this._requestService.findAppointmentsByDate(this.yyyy_mm_dd(date)).subscribe((appointments: Appointment[]) => {
                let hf_duplicate = false;
                for (var i = 0; i < this.days.length; i++) {
                    if (this.days[i].date.getTime() == date.getTime()) {
                        hf_duplicate = true;
                    }
                }

                appointments.forEach((appointment: Appointment) => {
                    appointment.date = new Date(appointment.date);
                });

                if (!hf_duplicate) {
                    this.days.push({date: date, appointments: appointments, isToday: date.toDateString() === (new Date()).toDateString() });
                    console.log(this.days);
                    this.days.sort((a:any, b:any) => a.date - b.date);
                }

                date = new Date(date);
                console.log(date);
                date.setDate(date.getDate() + 1);
            });
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
        this.popup.style.display = "block";
        var f = this.form,
            d = day.date,
            y = hour + ":" + x*15;
        d.setHours(hour);
        d.setMinutes(x*15);
        f.date.value = this.yyyy_mm_dd(d, true);
        f.getElementsByTagName("h3")[0].innerHTML = this.dateToTitle(d) + " " + y;
        this.selectOptionByValue(f.doctor, doctor.id);
        this.form.patient.disabled = false;
        this.form.customer.disabled = false;
        this.currentCustomer = null;
        this.customersSearchList = null;
        this.form.customer.value = "";
        this.currentPatients = [];
        this.selectedPatientId = null;
        this.form.room.selectedIndex = -1;
        this.form.type.selectedIndex = -1;
    }
    updateAppointment(appointment) {
        this.popup = document.querySelector('.vetCal-popup');
        this.form = document.querySelector('#vetCal-appointment-form');
        this.popup.style.display = "block";        
        this.updateAppointement = true;
        var f = this.form,
            d = appointment.date,
            x = d.getHours() + ":" + d.getMinutes();
        f.date.value = this.yyyy_mm_dd(d, true);
        f.getElementsByTagName("h3")[0].innerHTML = this.dateToTitle(d) + " " + x;
        this.selectOptionByValue(f.doctor, appointment.doctorId);
        this.selectOptionByValue(f.room, appointment.roomId);
        this.selectOptionByValue(f.type, appointment.type);
        this.selectedPatientId = appointment.patientId;

        this._requestService.findCustomerByPatientId(appointment.patientId).subscribe((customer: Customer) => {
            this.currentCustomer = customer;
            this.customersSearchList = null;
            this.form.customer.value = customer.name;
            this._requestService.findPatientsByCustomerId(customer.id).subscribe((patients: Patient[]) => {
                this.currentPatients = patients;
            });
        });
        
        this.form.patient.disabled = true;
        this.form.customer.disabled = true;
    }
    removeAppointment(){
        this._requestService.removeAppointment(this.form.date.value, this.form.patient.value).subscribe((appointment: Appointment) => {
            this.update();
            (document.querySelector('.vetCal-popup') as HTMLElement).style.display = "none";
        });
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
        var f = this.form;
        this.customersSearchList = this.searchCustomers(f.customer.value);
    }

    ngAfterViewChecked(){
        let f = this.form;
        
        if(this.currentPatients.length > 0){
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
            this._requestService.modifyAppointment(form.date.value, form.patient.value, data).subscribe((appointment: Appointment) => {
                this.update();
                (document.querySelector('.vetCal-popup') as HTMLElement).style.display = "none";
            });
        }else{
            data.append("patient_id", form.patient.value);
            data.append("doctor_id", form.doctor.value);
            data.append("date", form.date.value);
            this._requestService.addAppointment(data).subscribe((appointment: Appointment) => {
                this.update();
                (document.querySelector('.vetCal-popup') as HTMLElement).style.display = "none";
            });
        }
    }

    refresh(){
        this.popup.style.display = "none";
        this.update();
    }
}

