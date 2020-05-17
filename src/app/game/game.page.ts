import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Game } from "../models/game";
import { FirebaseService } from "src/services/firebase.service";
import { Critic } from "../models/critic";
import { User } from "../models/user";
import { MenuController } from '@ionic/angular';

@Component({
  selector: "app-game",
  templateUrl: "./game.page.html",
  styleUrls: ["./game.page.scss"],
})
export class GamePage implements OnInit {
  game: Game ;
  allCritics: Critic[] = [];
  userCritics: Critic[] = [];
  mediaCritics: Critic[] = [];
  userScore: string;
  mediaScore: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private menuCtrl: MenuController
  ) {
    this.game = new Game();
    this.menuCtrl.enable(false);

   }

  ngOnInit() {
    this.firebaseService
      .getGame(this.activatedRoute.snapshot.paramMap.get("idGame"))
      .subscribe((dataGame: Game) => {
        this.game = dataGame;
        this.game.releaseDate = new Date(this.game.releaseDateBD);

        this.getCriticsOfTheGame();
      });
  }

  getCriticsOfTheGame() {
    this.firebaseService.getCritics().subscribe((data: Critic[]) => {
      let contador = 0;
      data.forEach((critic: Critic) => {
        contador++;
        if (critic.id_game == this.game.id) {
          this.allCritics.push(critic);
        }
      });

      this.allCritics.forEach((critic2: Critic) => {
        this.firebaseService
          .getUsuario(+critic2.id_user -1)
          .subscribe((userData: User) => {
            if (userData.id_media == "0") {
              this.userCritics.push(critic2);
            } else {
              critic2.media = userData.username;
              this.mediaCritics.push(critic2);
            }
          });
      });

      setTimeout(() => {
        let partialMediaScore = 0;
        this.mediaCritics.forEach((critic: Critic) => {
          partialMediaScore += +critic.score;
        });
        this.mediaScore =
          "" + Math.trunc(partialMediaScore / this.mediaCritics.length);

        let partialUserScore = 0;
        this.userCritics.forEach((critic: Critic) => {
          partialUserScore += +critic.score;
        });
        this.userScore =
          "" + Math.trunc(partialUserScore / this.userCritics.length);
      }, 200);
    });
  }

  color(value) {
    if (this.game.releaseDate.getTime() > Date.now() || this.game.releaseDateBD == "TBD"
    ) {
      value = "-";
    }
    if (+value < 50) {
      return "danger";
    } else if (+value < 70) {
      return "warning";
    } else if (+value < 85) {
      return "success";
    } else if (+value < 101) {
      return "favorite";
    }else {
      return "medium";
    }
  }

  getNameMedia(critic:Critic){
    this.firebaseService.getUsuario(critic.id_user).subscribe(
      (data:User) => {
        return data.username;
      }
    );
  }
}
