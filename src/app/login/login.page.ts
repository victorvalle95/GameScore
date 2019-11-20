import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { FirebaseService } from 'src/services/firebase.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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
  userLoged;
  activeLang = 'es';


  constructor(
    public authService: AuthFirebaseService,
    private translate: TranslateService,
    public firebaseService: FirebaseService,
    public alertController: AlertController) 
  {
    firebaseService.getUsuarios()
      .subscribe(data => {
        this.users = data;
      });
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit() {
    this.loginCorrecto = false;
  }

  login(email, pass) {
    this.authService.signInWithEmail(email.value, pass.value).then(
      res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created";
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
  }

  async presentAlertPrompt() {
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
