import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthFirebaseService } from '../providers/auth/auth-firebase.service';
import { AlertController, ToastController, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { User } from '../models/user';

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
  //medias: Media[];

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthFirebaseService,
    public alertController: AlertController,
    public translate: TranslateService,
    public firebase: FirebaseService,
    public toastController: ToastController,
    private menuCtrl: MenuController,

    public router: Router) {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      id_media: ['0'],
      tlf: ['', Validators.compose([Validators.required, Validators.pattern('[0-9 ]*'),Validators.minLength(9),Validators.maxLength(9)])],
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
    })
  }

  ngOnInit() {
    //this.menuCtrl.enable(false);

    this.firebase.getUsuarios().subscribe(
      (data: User[]) => {
        this.users = data;
      });

  }

  adjudicarMedia() {
    console.log(this.registerForm.get("id_media").value);

    this.users.forEach((user:User) => {
      if(+this.registerForm.get("id_media").value<=+user.id_media){
        this.registerForm.get("id_media").setValue(+user.id_media+1);
      }
      
    });
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
            this.actualUser.image="https://firebasestorage.googleapis.com/v0/b/gamescore-c3aef.appspot.com/o/user-png-icon-male-user-icon-512.png?alt=media&token=caabdb80-340c-4ccf-92ed-461cf5faad24";
            this.firebase.saveUsuario(this.actualUser, this.users.length);

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

  cleanMedia(){
    this.registerForm.get("id_media").setValue("0");
  }

}
