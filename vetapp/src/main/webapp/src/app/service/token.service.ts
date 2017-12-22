import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TokenService{

    data : any = null;
    login : string = null;
    password : string = null;

    constructor(private _http: Http){ }

    getNewToken(login, mdp, callback){
        this.login = login;
        this.password = mdp;

        let username: string = 'vetapp';
        let password: string = 'Test123*';
        let headers: Headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        //console.log(headers);
        const options = new RequestOptions({headers: headers});
        return this._http.post('/oauth/token?grant_type=password&username='+login+'&password='+mdp, this.data, options)
                    .map((res: Response) => res.json())
                    .subscribe(data => {
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
        let headers: Headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        //console.log(headers);
        const options = new RequestOptions({headers: headers});
        return this._http.post('/oauth/token?grant_type=refresh_token&refresh_token='+this.data.refresh_token, this.data, options)
                    .map((res: Response) => res.json())
                    .subscribe(data => {
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

    getMyToken(){
        if(this.data != null){
            let headers: Headers = new Headers();
            headers.append("Authorization", "Bearer "+this.data.access_token);
            //console.log(headers);
            const options = new RequestOptions({headers : headers})
            return options;
        }
    }
}