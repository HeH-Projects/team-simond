import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable()
export class TokenService{

    data : any = null;
    login : string = null;
    password : string = null;

    constructor(private _http: HttpClient){ }

    getNewToken(login, mdp, callback){
        this.login = login;
        this.password = mdp;

        let username: string = 'vetapp';
        let password: string = 'Test123*';

        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
        //console.log(headers);

        return this._http.post('/oauth/token?grant_type=password&username='+login+'&password='+mdp, this.data, {headers}).subscribe(data => {
                        this.data = data;
                        //console.log(data);
                        if(callback){
                            callback(data);
                        }
                    },(err :HttpErrorResponse) => {
                        if(err.status == 401 || err.status == 400){
                            callback("error");
                        }
                    });
    }

    refreshMyToken(){
        let username: string = 'vetapp';
        let password: string = 'Test123*';
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers = headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this._http.post('/oauth/token?grant_type=refresh_token&refresh_token='+this.data.refresh_token, this.data, {headers}).subscribe(data => {
                        this.data = data;
                        //console.log(data);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this.getNewToken(this.login, this.password, null);
                            }
                        }
                    });
    }

    getMyToken(): HttpHeaders{
        if(this.data != null){
            const headers = new HttpHeaders().set("Authorization", "Bearer "+this.data.access_token);
            //console.log(headers);

            return headers;
        }
    }
}