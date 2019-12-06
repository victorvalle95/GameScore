import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  constructor(
    private formBuilder: FormBuilder, 
    public authService: AuthFirebaseService,
    public alertController: AlertController,
    public translate: TranslateService,
    public router: Router) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mediaCompany: [''],
      phone: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit() {
  }

  register(value) {
    this.authService.doRegister(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created";
        this.presentAlert(this.successMessage,true);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
        this.presentAlert(this.errorMessage,false);
      })
  }

  async presentAlert(message,control) {
    const alert = await this.alertController.create({
      header: this.translate.instant("REGISTER.REGISTER"),
      subHeader: "",
      message: message,
      buttons: [
        {
          text: 'OK',
          handler:(data)=>{
            if(control===true)
              this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

}
