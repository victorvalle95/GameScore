import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { Critic } from '../models/critic';
import { ModalController, AlertController } from '@ionic/angular';
import { User } from '../models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private route: Router) { }

  @Input() userLoged: User;

  ngOnInit() {
    console.log(this.userLoged);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  logout() {
    this.route.navigate(['/login']);
    this.dismiss();
    setTimeout(() => {
      window.location.reload();
    },50)

  }
}
