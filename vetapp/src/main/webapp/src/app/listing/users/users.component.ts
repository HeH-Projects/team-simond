import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'pm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  token : any = null;
  constructor(private _tokenService : TokenService) { }

  ngOnInit() {
    this.token = this._tokenService.getMyToken();
  }

}
