import { Component } from '@angular/core';
import { TokenService } from './../service/token.service'

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

    
    doctor : any = null;
    user : User = new User();
    loginForm : NgForm;

    constructor(private _router : Router, private _tokenService : TokenService){ }

    submit(loginForm : NgForm){
        this.loginForm = loginForm
        //console.log(loginForm.form);
        //console.log('Saved: ' + JSON.stringify(loginForm.value));
        this._tokenService.getMyToken(this.user.login, this.user.password, function(token){
            this._router.navigate(['/home']);
        }.bind(this));
    }

    

    /*callDoctor(){
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
    }*/
}
