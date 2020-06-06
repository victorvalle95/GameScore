import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { Critic } from '../models/critic';
import { ModalController, AlertController } from '@ionic/angular';
import { User } from '../models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-user-critics',
  templateUrl: './modal-user-critics.component.html',
  styleUrls: ['./modal-user-critics.component.scss'],
})
export class ModalUserCriticsComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private route: Router) { }

  @Input() userCritics: Critic[]

  @Input() userLoged: User;

  @Input() numberCritics: number;

  @Input() idGame: string;

  ngOnInit() {
    console.log(this.userCritics);
  }

  color(value) {
    if (+value < 50) {
      return "danger";
    } else if (+value < 75) {
      return "warning";
    } else if (+value < 85) {
      return "success";
    } else if (+value < 101) {
      return "favorite";
    } else {
      return "medium";
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Añadir crítica',
      inputs: [
        {
          name: 'critic',
          placeholder: 'Critic'
        },
        {
          name: 'score',
          placeholder: 'Score'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            //añadir si el usuario que va a añadirlo no ha añadido aun ninguna crítica a este juego
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            let newCritic: Critic = new Critic();
            newCritic.comments = data.critic;
            newCritic.score = data.score;
            newCritic.id_game = this.idGame;
            newCritic.id_user = this.userLoged.id;

            this.firebaseService.saveCritic(newCritic, this.numberCritics);

          }
        }
      ]
    });

    await alert.present();
  }

  goToSuggestions() {
    this.route.navigate(['/suggestions']);
    this.dismiss();
  }
}
