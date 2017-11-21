import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';

@Component({
  templateUrl: './login.component.html',
  styleUrls : ['./login.component.css']
})
export class LoginComponent {

    data : any = null;
    doctor : any =null;
    user : User = new User();
    loginForm : NgForm;

    constructor(private _http: Http, private router: Router){ }

    submit(loginForm : NgForm){
        this.loginForm = loginForm
        //console.log(loginForm.form);
        //console.log('Saved: ' + JSON.stringify(loginForm.value));
        this.getMyToken(this.user.login, this.user.password);
    }

    getMyToken(login, mdp){
        let username: string = 'vetapp';
        let password: string = 'Test123*';
        let headers: Headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        console.log(headers);
        const options = new RequestOptions({headers: headers});
        return this._http.post('http://localhost:8080/oauth/token?grant_type=password&username='+login+'&password='+mdp, this.data, options)
                    .map((res: Response) => res.json())
                    .subscribe(data => {
                        this.data = data;
                        console.log(data);
                        this.router.navigate(['/home']);
                    },(err :HttpErrorResponse) => {
                        if(this.data){
                            //this.loginError = "error login";
                            this.loginForm.value.loginError = "error login";
                        }
                    });
    }

    refreshMyToken(){
        let username: string = 'vetapp';
        let password: string = 'Test123*';
        let headers: Headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        console.log(headers);
        const options = new RequestOptions({headers: headers});
        return this._http.post('http://localhost:8080/oauth/token?grant_type=refresh_token&refresh_token='+this.data.refresh_token, this.data, options)
                    .map((res: Response) => res.json())
                    .subscribe(data => {
                        this.data = data;
                        console.log(data);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this.getMyToken(this.user.login, this.user.password);
                            }
                        }
                    });
    }

    callDoctor(){
        return this._http.get('http://localhost:8080/api/json/doctor/1/?access_token='+this.data.access_token)
                    .map((res: Response) => res.json())
                    .subscribe(doctor => {
                        this.doctor = doctor.doctor;
                        console.log(this.doctor);
                    }, (err: HttpErrorResponse) =>{
                        if( err.error instanceof Error){
                            console.log('An error occurred: ', err.error.message)
                        }else{
                            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                            if(err.status == 401){
                                this.refreshMyToken();
                            }
                        }
                    });
    }
}
