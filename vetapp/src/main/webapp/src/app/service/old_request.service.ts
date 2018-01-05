/*
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from './token.service';
import {Room} from "../models/room";

@Injectable()
export class OldRequestService{
    
    context : any;
    data : any = null;
    rooms: Room[];

    constructor(private _http : Http, private _tokenService : TokenService) {}
    
    callDoctors(){
        return this._http.get('/api/json/doctors', this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data => {
                        this.context.doctors = data.doctors;
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
                    .subscribe(data => {
                        this.context.rooms = data.rooms;
                        this.rooms = data.rooms;
                        for(let i=0; i < this.context.rooms.length; i++){
                            this.context.roomNames[this.context.rooms[i].id] = this.context.rooms[i].name;
                        }
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
                    .subscribe(data => {
                        this.context.setCustomers([data.customer]);
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
                    .subscribe(data => {
                        //this.context.patients = patients.patients;
                        this.context.setPatients(data.patients);
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
                    .subscribe(data => {
                        this.context.setCustomers(data.customers);
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

    addRoom(data : FormData){
        return this._http.post('/api/create/room', data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe()
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    removeRoom(name : string){
        return this._http.post('/api/delete/room/0/'+name, null, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe()
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    addCustomer(data: FormData){
        return this._http.post('/api/create/customer', data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    modifyCustomer(id: number, data: FormData){
        return this._http.post('/api/update/customer/'+id, data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    removeCustomer(id : number){
        return this._http.post('/api/delete/customer/'+id, null, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    addPatient(data: FormData){
        return this._http.post('/api/create/patient', data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    modifyPatient(id: number, data: FormData){
        return this._http.post('/api/update/patient/'+id, data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    removePatient(id: number){
        return this._http.post('/api/delete/patient/'+id, null, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    addAppointment(data: FormData){
        return this._http.post('/api/create/appointment', data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    modifyAppointment(date: string, patientId: string, data: FormData){
        return this._http.post('/api/update/appointment/'+date+"/"+patientId, data, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }

    removeAppointement(date: string, patientId: string){
        return this._http.post('/api/delete/appointment/'+date+"/"+patientId, null, this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(data =>{
                        this.context.refresh();
                    })
                    , (err: HttpErrorResponse) =>{
                        if(err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err}`);
                            if(err.status == 401){
                                this._tokenService.refreshMyToken();
                            }
                        }
                    };
    }
}
*/