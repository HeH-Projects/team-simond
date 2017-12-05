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
    badLogin : boolean = false;

    constructor(private _router : Router, private _tokenService : TokenService){ }

    submit(loginForm : NgForm){
        this.loginForm = loginForm
        //console.log(loginForm.form);
        //console.log('Saved: ' + JSON.stringify(loginForm.value));
        this._tokenService.getNewToken(this.user.login, this.user.password, function(token){
            if(token == "error"){
                this.badLogin = true;
            }else{
                this._router.navigate(['/home']);
            }
        }.bind(this));
    }
}
