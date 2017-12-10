import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable()
export class RequestService{
    
    context : any;

    constructor(private _http : Http, private _tokenService : TokenService) {}
    
    callDoctors(){
        return this._http.get('/api/json/doctors', this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(doctors => {
                        this.context.doctors = doctors.doctors;
                        //console.log('doctors : '+this.doctors);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    });
    }

    callRooms(){
        return this._http.get('/api/json/rooms', this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(rooms => {
                        this.context.rooms = rooms.rooms;
                        for(let i=0; i < this.context.rooms.length; i++){
                            this.context.roomNames[this.context.rooms[i].id] = this.context.rooms[i].name;
                        }
                        //console.log('rooms : '+this.rooms);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    });
    }

    findCustomerByPatientId(id : number){
        return this._http.get('/api/json/customer/0/'+id, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(customer => {
                        this.context.customers = [customer.customer];
                        //console.log('rooms : '+this.rooms);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    });
    }

    findPatientsByCustomerId(id : number){
        return this._http.get('/api/json/patients?customer='+id, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(patients => {
                        if(!Array.isArray(patients.patients)){
                            patients.patients = [patients.patients];
                        }
                        this.context.patients = patients.patients;
                        //console.log('rooms : '+this.rooms);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    });
    }

    findCustomersByIncompleteName(name : string){
        return this._http.get('/api/json/customers/'+name, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(customers => {
                        if(!Array.isArray(customers.customers)){
                            customers.customers = [customers.customers];
                        }
                        this.context.customers = customers.customers;
                        console.log('customer : '+this.context.customers);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    });
    }
}