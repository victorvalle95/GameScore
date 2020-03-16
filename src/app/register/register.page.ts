import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { User } from '../models/user';
import { Media } from '../models/media';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  actualUser: User;
  users: User[];
  medias: Media[];

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthFirebaseService,
    public alertController: AlertController,
    public translate: TranslateService,
    public firebase: FirebaseService,
    public router: Router) {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      media_company: [''],
      tlf: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    })
  }

  ngOnInit() {
    this.firebase.getUsuarios().subscribe(
      (data: User[]) => {
        this.users = data;
      });
  }

  mediaExists(value) {
    this.firebase.getMedia().subscribe(
      (data: Media[]) => {
        this.medias = data;
        this.medias.forEach(
          (media) => {
            if (media.name == this.registerForm.controls['media_company'].value) {
              if (this.registerForm.controls['media_company'].value == '') {
                this.authService.doRegister(value)
                  .then(res => {
                    console.log(res);
                    this.errorMessage = "";
                    this.successMessage = "Your account has been created";
                    this.presentAlert(this.successMessage, true);
                  }, err => {
                    console.log(err);
                    this.errorMessage = err.message;
                    this.successMessage = "";
                    this.presentAlert(this.errorMessage, false);
                  })
              }
              else {
                this.errorMessage = "Media no existe";
                this.successMessage = "";
                this.presentAlert(this.errorMessage, false);
              }
            }
          }
        )
      }
    )
  }

  register(value) {
    this.actualUser = value;
    this.mediaExists(value);
  }

  async presentAlert(message, control) {
    const alert = await this.alertController.create({
      header: this.translate.instant("REGISTER.REGISTER"),
      subHeader: "",
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            if (control === true)
              this.router.navigate(['/login']);
            this.firebase.saveUsuario(this.actualUser, this.users.length);
          }
        }
      ]
    });

    await alert.present();
  }
}
