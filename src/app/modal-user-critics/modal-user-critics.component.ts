import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { Critic } from '../models/critic';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Game } from '../models/game';
import { UserComponent } from '../user/user.component';


@Component({
  selector: 'app-modal-user-critics',
  templateUrl: './modal-user-critics.component.html',
  styleUrls: ['./modal-user-critics.component.scss'],
})
export class ModalUserCriticsComponent implements OnInit {

  userCritics: Critic[] = [];
  addControl: boolean;
  allCritics: Critic[] = [];
  numberCritics: number;
  userScore: string;

  @Input() userLoged: User;

  @Input() game: Game;


  constructor(
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private route: Router,
    public modalController: ModalController,
    ) { }



  ngOnInit() {
    console.log(this.userLoged);

    this.addControl = true;
    this.getCriticsOfTheGame();

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

  async addCritic() {
    const alert = await this.alertCtrl.create({
      header: 'Add critic',
      inputs: [
        {
          name: 'critic',
          placeholder: 'Critic'
        },
        {
          name: 'score',
          placeholder: 'Score (0-100)'
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
          handler: async (data) => {
            console.log('Confirm Ok');
            if (this.addControl == true) {
              if (+data.score >= 0 && +data.score <= 100) {
                let newCritic: Critic = new Critic();
                newCritic.comments = data.critic;
                newCritic.score = data.score;
                newCritic.id_game = this.game.id;
                newCritic.id_user = this.userLoged.id;
                console.log(this.numberCritics);
                this.firebaseService.saveCritic(newCritic, this.numberCritics);

                this.alertOK('added');
              } else {
                this.alertIncorrectScore();
              }
            } else {
              this.alertAlreadyAdded();
            }
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

  async editCritic(editCritic: Critic) {
    const alert = await this.alertCtrl.create({
      header: 'Edit crítica',
      inputs: [
        {
          name: 'critic',
          placeholder: 'Critic',
          value: editCritic.comments
        },
        {
          name: 'score',
          placeholder: 'Score',
          value: editCritic.score
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
          handler: async (data) => {
            console.log('Confirm Ok');
            let newCritic: Critic = new Critic();
            newCritic.comments = data.critic;
            newCritic.score = data.score;
            newCritic.id_game = this.game.id;
            newCritic.id_user = this.userLoged.id;
            newCritic.id = editCritic.id;
            console.log(this.numberCritics);

            this.firebaseService.updateCritic(newCritic);
            this.alertOK('edited');
          }
        }
      ]
    });

    await alert.present();
  }

  removeCritic(critic: Critic){
    this.firebaseService.removeCritic(critic.id);
    this.alertOK("removed");
  }

  getCriticsOfTheGame() {
    this.firebaseService.getCritics().subscribe((data: Critic[]) => {
      console.log(data);
      let contador = 0;
      this.numberCritics = data.length;
      data.forEach((critic: Critic) => {
        contador++;
        if (critic.id_game == this.game.id) {
          this.allCritics.push(critic);
        }
      });

      this.allCritics.forEach((critic2: Critic) => {
        this.firebaseService
          .getUsuario(+critic2.id_user - 1)
          .subscribe((userData: User) => {
            if (userData.id_media == "0") {
              critic2.media = userData.username;
              this.userCritics.push(critic2);
            }
          });
      });

      setTimeout(() => {

        if (this.game.releaseDateBD != 'TBD' && this.game.releaseDate.getTime() <= Date.now()) {
          let partialUserScore = 0;
          this.userCritics.forEach((critic: Critic) => {
            partialUserScore += +critic.score;
          });

          this.userScore =
            "" + Math.trunc(partialUserScore / this.userCritics.length);

        } else {
          this.userScore = "-";
        }

        this.userCritics.forEach(
          (userCritic) => {
            if (userCritic.id_user == this.userLoged.id) {
              this.addControl = false;
            }
          }
        )

      }, 200);
    });
  }

  async alertOK(txt) {
    const alert = await this.alertCtrl.create({
      message: 'Critic '+txt+' correctly. Now the application will be reload',
      subHeader: 'Added',
      buttons: [
        {
          text: 'Ok',
          handler: async (data) => {
            console.log('Confirm Ok');
            window.location.reload();
          }
        }
      ]
    });
    await alert.present();
  }

  async alertAlreadyAdded() {
    const alert = await this.alertCtrl.create({
      message: 'This user have already had a critic added',
      subHeader: 'Not added',
      buttons: ['Ok']
    });
    await alert.present();
  }

  async alertIncorrectScore() {
    const alert = await this.alertCtrl.create({
      message: 'The score must be between 0 and 100',
      subHeader: 'Not added',
      buttons: ['Ok']
    });
    await alert.present();
  }

  async presentModalUsuario() {
    const modal = await this.modalController.create({
      component: UserComponent, componentProps: {
        userLoged: this.userLoged
      }
    });
    return await modal.present();
  }


}
