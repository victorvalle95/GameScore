import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { FirebaseService } from 'src/services/firebase.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginCorrecto: boolean;
  errorMessage: string;
  successMessage: string;
  users = [];
  userLoged: any;


  constructor(
    public authService: AuthFirebaseService,
    public firebaseService: FirebaseService,
    public alertController: AlertController,
    public route:Router) 
  {
    firebaseService.getUsuarios()
      .subscribe(data => {
        this.users = data;
      });
  }

  ngOnInit() {
    this.loginCorrecto = false;
  }

  login(email, pass) {
    this.route.navigate(['/main-page']);
    /*
    this.authService.signInWithEmail(email.value, pass.value).then(
      res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been loged";
        for (let user of this.users) {
          if (user.email == email) {
            this.userLoged = user;
          }
        }
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      });
      */
  }

  async recuperarEmailAlert() {
    const alert = await this.alertController.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'emailRecover',
          type: 'text',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            this.authService.recoveryPassword(data.emailRecover);
          }
        }
      ]
    });

    await alert.present();
  }

  googleAuth() {
    this.authService.googleAuth();
  }

}
