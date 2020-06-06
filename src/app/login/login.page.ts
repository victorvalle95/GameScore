import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { FirebaseService } from 'src/services/firebase.service';
import { AlertController, MenuController, Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginCorrecto: boolean;
  errorMessage: string;
  successMessage: string;
  userLoged: User = new User();
  users: User[] = [];


  constructor(
    private authService: AuthFirebaseService,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private route: Router,
    private platform: Platform,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);

    firebaseService.getUsuarios()
      .subscribe((data: User[]) => {
        this.users = data;
      });
  }

  ngOnInit() {
    this.loginCorrecto = false;
  }

  login(username, pass) {
    for (let user of this.users) {
      if (user.username == username.value && user.password == pass.value) {
          this.userLoged = user;
          this.route.navigate(['/main-page', this.userLoged.id]);
          return "";
      } 
    }
    this.presentAlert("Incorrect user datas");
  }

  loginGuest(){
    this.route.navigate(['/main-page', '0']);
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  goToSuggestions(){
    this.route.navigate(['/suggestions']);
  }
}
