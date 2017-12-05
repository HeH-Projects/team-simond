import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable()
export class RequestService{
    
    doctors : any;
    rooms : any;
    clients : any;

    constructor(private _http : Http, private _tokenService : TokenService) {}
    
    callDoctors(){
        return this._http.get('/api/json/doctors', this._tokenService.getMyToken())
                    .map((res: Response) => res.json())
                    .subscribe(doctors => {
                        this.doctors = doctors.doctors;
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
                        this.rooms = rooms.rooms;
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
}