import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { AlertController, ToastController } from '@ionic/angular';
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
  controlMedia: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthFirebaseService,
    public alertController: AlertController,
    public translate: TranslateService,
    public firebase: FirebaseService,
    public toastController: ToastController,
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
    console.log(this.registerForm.controls['media_company'].value);
    this.firebase.getMedia().subscribe(
      (data: Media[]) => {
        this.medias = data;
        this.controlMedia = false;
        this.medias.forEach(
          (media) => {
            if (this.controlMedia === false) {
              if (media.name == this.registerForm.controls['media_company'].value) {
                this.errorMessage = "Media existe";
                this.successMessage = "";
                this.controlMedia = true;
                this.presentToast(this.errorMessage);
              }
            }
          }
        );

        if (this.controlMedia === false) {
          this.errorMessage = "Media no existe";
          this.successMessage = "";
          this.presentToast(this.errorMessage);
        }
      }
    )
  }

  register(value) {
    this.actualUser = value;
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant("REGISTER.REGISTER"),
      subHeader: "",
      message: "Correcto",
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            this.router.navigate(['/login']);
            this.firebase.saveUsuario(this.actualUser, this.users.length);
            this.registerForm.reset();

          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  controlarMedia() {
    if (this.controlMedia == true) {
      return true;
    } else {
      if (this.registerForm.controls['media_company'].value == '') {
        return true
      }
      else {
        return false;
      }
    }
  }

  changeControlMedia(){
    this.controlMedia = false;
  }

}
