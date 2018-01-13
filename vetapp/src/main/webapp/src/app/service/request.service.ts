import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {Doctor} from "../models/doctor";
import {TokenService} from "./token.service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from "rxjs/operators";
import {MessageService} from "./message.service";
import {Room} from "../models/room";
import {Customer} from "../models/customer";
import {Patient} from "../models/patient";
import {Appointment} from "../models/appointment";

@Injectable()
export class RequestService {

    constructor(private _http : HttpClient, private _tokenService : TokenService, private messageService: MessageService) { }

    /**********************************************************************************************/

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {

            // Log l'erreur
            this.log(`${operation} failed: ${error.message}`);

            if( error.error instanceof Error){
                this.log('An error occurred: ' + error.error.message)
            }else{
                this.log(`Backend returned code ${error.status}, body was: ${error.error}`);
                if(error.status == 401){
                    this.log("refreshing token");
                    this._tokenService.refreshMyToken();
                }
            }

            //Séparation pour les logs suivants
            this.messageService.add('-----------------------------------------------------------');

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log dans le messageService */
    private log(message: string) {
        this.messageService.add('requestService: ' + message);
    }

    /**********************************************************************************************/

    getDoctors(): Observable<Doctor[]>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Doctor[]>('/api/json/doctors', {headers})
            .pipe(
                tap((doctors: Doctor[]) => this.log(`fetched doctors =${doctors}`)),
                catchError(this.handleError<Doctor[]>('getDoctors'))
            );
    }

    getCustomers(): Observable<Customer[]>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Customer[]>('/api/json/customers', {headers})
            .pipe(
                tap((customers: Customer[]) => this.log(`fetched customers =${customers}`)),
                catchError(this.handleError<Customer[]>('getCustomers'))
            );
    }

    getRooms(): Observable<Room[]>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Room[]>('/api/json/rooms', {headers})
            .pipe(
                tap((rooms: Room[]) => this.log(`fetched rooms =${rooms}`)),
                catchError(this.handleError<Room[]>('getRooms'))
            );
    }

    findAppointmentsByDate(date): Observable<Appointment[]>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Appointment[]>('/api/json/appointments/'+date, {headers})
            .pipe(
                tap((appointments: Appointment[]) => this.log(`found appointments (${appointments}) by date: ${date}`)),
                catchError(this.handleError<Appointment[]>('findAppointmentsByDate'))
            );
    }

    findCustomerByPatientId(id : number): Observable<Customer>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Customer>('/api/json/customer/0/'+id, {headers})
            .pipe(
                tap((customer: Customer) => this.log(`found customer (${customer.name}) by patient id`)),
                catchError(this.handleError<Customer>('findCustomerByPatientId'))
            );
    }

    findPatientsByCustomerId(id : number): Observable<Patient[]>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Patient[]>('/api/json/patients?customer='+id, {headers})
            .pipe(
                tap((patients: Patient[]) => this.log(`found patients (${patients}) by customer id`)),
                catchError(this.handleError<Patient[]>('findPatientsByCustomerId'))
            );
    }

    findCustomersByIncompleteName(name : string): Observable<Customer[]>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Customer[]>('/api/json/customers/'+name, {headers})
            .pipe(
                tap((customers: Customer[]) => this.log(`found customers (${customers}) by incomplete name`)),
                catchError(this.handleError<Customer[]>('findCustomersByIncompleteName'))
            );
    }

    /*
    searchRooms(term: string): Observable<Room[]> {
        if (!term.trim()) {
            // if not search term, return empty hero array.
            return of([]);
        }

        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.get<Room[]>('/api/json/rooms/'+term, {headers}).pipe(
            tap((rooms: Room[]) => {
                if(rooms.length == 0){
                    this.log(`didn't find any rooms matching "${term}"`);
                }else{
                    this.log(`found rooms matching "${term}"`);
                }
            }),
            catchError(this.handleError<Room[]>('searchRooms', []))
        );
    }*/

    addDoctor(data: FormData): Observable<Doctor>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post<Doctor>('/api/create/doctor', data, {headers})
            .pipe(
                tap((doctor: Doctor) => this.log(`added customer with id=${doctor.id}`)),
                catchError(this.handleError<Doctor>('addDoctor'))
            );
    }

    modifyDoctor(id: number, data: FormData): Observable<Doctor>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post<Doctor>('/api/update/doctor/'+id, data, {headers})
            .pipe(
                tap((doctor: Doctor) => this.log(`updated doctor: ${doctor}`)),
                catchError(this.handleError<Doctor>('modifyDoctor'))
            );
    }

    removeDoctor(id : number): Observable<Doctor>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.delete<Doctor>('/api/delete/doctor/'+id, {headers})
            .pipe(
                tap(_ => this.log(`removed doctor with id=${id}`)),
                catchError(this.handleError<Doctor>('removeDoctor'))
            );
    }

    addRoom(data : FormData): Observable<Room>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post<Room>('/api/create/room', data, {headers})
            .pipe(
                tap((room: Room) => this.log(`added room with id=${room.id}`)),
                catchError(this.handleError<Room>('addRoom'))
            );
    }

    removeRoom(name : string): Observable<Room>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.delete<Room>('/api/delete/room/0/'+name, {headers})
            .pipe(
                tap((room: Room) => this.log(`removed room with id=${room.id}`)),
                catchError(this.handleError<Room>('removeRoom'))
            );
    }

    addCustomer(data: FormData): Observable<Customer>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post<Customer>('/api/create/customer', data, {headers})
            .pipe(
                tap((customer: Customer) => this.log(`added customer with id=${customer.id}`)),
                catchError(this.handleError<Customer>('addCustomer'))
            );
    }

    modifyCustomer(id: number, data: FormData): Observable<Customer>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post('/api/update/customer/'+id, data, {headers})
            .pipe(
                tap((customer: Customer) => this.log(`updated customer: ${customer}`)),
                catchError(this.handleError<Customer>('modifyCustomer'))
            );
    }

    removeCustomer(id : number): Observable<Customer>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.delete<Customer>('/api/delete/customer/'+id, {headers})
            .pipe(
                tap(_ => this.log(`removed customer with id=${id}`)),
                catchError(this.handleError<Customer>('removeCustomer'))
            );
    }

    addPatient(data: FormData): Observable<Patient>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post<Patient>('/api/create/patient', data, {headers})
            .pipe(
                tap((patient: Patient) => this.log(`added patient with id=${patient.id}`)),
                catchError(this.handleError<Patient>('addPatient'))
            );
    }

    modifyPatient(id: number, data: FormData): Observable<Patient>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post('/api/update/patient/'+id, data, {headers})
            .pipe(
                tap((patient: Patient) => this.log(`updated patient: ${patient}`)),
                catchError(this.handleError<Patient>('modifyPatient'))
            );
    }

    removePatient(id: number): Observable<Patient>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.delete<Patient>('/api/delete/patient/'+id, {headers})
            .pipe(
                tap(_ => this.log(`removed patient with id=${id}`)),
                catchError(this.handleError<Patient>('removePatient'))
            );
    }

    addAppointment(data: FormData): Observable<Appointment>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post<Appointment>('/api/create/appointment', data, {headers})
            .pipe(
                tap((appointment: Appointment) => this.log(`added appointment with date=${appointment.date}`)),
                catchError(this.handleError<Appointment>('addAppointment'))
            );
    }

    modifyAppointment(date: string, patientId: string, data: FormData): Observable<Appointment>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.post('/api/update/appointment/'+date+"/"+patientId, data, {headers})
            .pipe(
                tap((appointment: Appointment) => this.log(`updated Appointment:${appointment} on date=${date} for patient id=${patientId}`)),
                catchError(this.handleError<Appointment>('modifyAppointment'))
            );
    }

    removeAppointment(date: string, patientId: string): Observable<Appointment>{
        const headers: HttpHeaders = this._tokenService.getMyToken();
        return this._http.delete<Appointment>('/api/delete/appointment/'+date+"/"+patientId, {headers})
            .pipe(
                tap(_ => this.log(`removed Appointment on date=${date} for patient id=${patientId}`)),
                catchError(this.handleError<Appointment>('removeAppointment'))
            );
    }
}