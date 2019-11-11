import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginCorrecto:boolean;
  constructor(public authService: AuthFirebaseService) { }

  ngOnInit() {
    this.loginCorrecto = false;
  }

  login(email,pass){
    this.authService.signInWithEmail(email,pass);
  }

}
