import { Component, OnInit, SecurityContext } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Game } from "../models/game";
import { FirebaseService } from "src/services/firebase.service";
import { Critic } from "../models/critic";
import { User } from "../models/user";
import { MenuController } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Director } from '../models/director';
import { Publisher } from '../models/publisher';
import { Developer } from '../models/developer';
import { ModalController } from '@ionic/angular';
import { ModalMediaCriticsComponent } from '../modal-media-critics/modal-media-critics.component';
import { Genre } from '../models/genre';
import { ModalUserCriticsComponent } from '../modal-user-critics/modal-user-critics.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: "app-game",
  templateUrl: "./game.page.html",
  styleUrls: ["./game.page.scss"],
})
export class GamePage implements OnInit {
  game: Game;
  allCritics: Critic[] = [];
  userCritics: Critic[] = [];
  mediaCritics: Critic[] = [];
  userScore: string;
  mediaScore: string;
  screenshots: string[];
  developer: Developer = new Developer();
  publisher: Publisher = new Publisher();
  director: Director = new Director();
  genres: string = "";

  numberCritics: number;

  userLoged: User = new User();

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private youtube: YoutubeVideoPlayer,
    public modalController: ModalController,
    public route: Router,

  ) {
    this.game = new Game();
  }

  ngOnInit() {
    this.firebaseService
      .getGame(+this.activatedRoute.snapshot.paramMap.get("idGame")-1)
      .subscribe((dataGame: Game) => {
        this.game = dataGame;
        this.game.releaseDate = new Date(this.game.releaseDateBD);
        this.screenshots = this.game.screenshots.split(',');
        console.log(this.screenshots);

        console.log(this.activatedRoute.snapshot.paramMap.get("userLoged"));

        this.getCriticsOfTheGame();
        this.datosVarios();
        this.cargarUserLoged();
      });
  }

  getCriticsOfTheGame() {
    this.firebaseService.getCritics().subscribe((data: Critic[]) => {
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
              this.userCritics.push(critic2);
            } else {
              critic2.media = userData.username;
              this.mediaCritics.push(critic2);
            }
          });
      });

      setTimeout(() => {
        if (this.game.releaseDateBD != 'TBD' && this.game.releaseDate.getTime() <= Date.now()) {
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
        } else {
          this.userScore = "-";
          this.mediaScore = "-";
        }

      }, 200);
    });
  }

  datosVarios() {
    this.firebaseService.getDirector(+this.game.id_director - 1).subscribe(
      (director: Director) => {
        this.director = director;

        this.firebaseService.getDeveloper(+this.game.id_developer - 1).subscribe(
          (developer: Developer) => {
            this.developer = developer;

            this.firebaseService.getPublisher(+this.game.id_publisher - 1).subscribe(
              (publisher: Publisher) => {
                this.publisher = publisher;
                this.game.id_genre.toString().split(',').forEach((idGenre) => {
                  this.firebaseService.getGenre(idGenre).subscribe(
                    (genre: Genre) => {
                      this.genres += genre.name + ",";
                      console.log(this.game.id_genre);
                    }
                  );
                });
                this.genres.substr(0, this.genres.length-1);
              }
            );
          }
        );
      }
    );
  }

  color(value) {
    if (this.game.releaseDate.getTime() > Date.now() || this.game.releaseDateBD == "TBD"
    ) {
      value = "-";
    }
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

  getNameMedia(critic: Critic) {
    this.firebaseService.getUsuario(critic.id_user).subscribe(
      (data: User) => {
        return data.username;
      }
    );
  }

  showCritics() {
    if (this.game.releaseDateBD == 'TBD' || this.game.releaseDate.getTime() > Date.now()) {
      return false;
    } else {
      return true;
    }
  }

  async presentModalUserCritic() {
    const modal = await this.modalController.create({
      component: ModalUserCriticsComponent, componentProps: {
        userCritics: this.userCritics,
        userLoged: this.userLoged,
        numberCritics: this.numberCritics,
        idGame: this.game.id
      }
    });
    return await modal.present();
  }

  openVideo() {
    this.youtube.openVideo(this.game.trailer);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalMediaCriticsComponent, componentProps: {
        userLoged: this.userLoged,
        numberCritics: this.numberCritics,
        game: this.game
      }
    });
    return await modal.present();
  }

  goToDirector(){
    this.route.navigate(['/director', this.director.id]);
  }

  goToPublisher(){
    this.route.navigate(['/publisher', this.publisher.id]);
  }
  
  goToDeveloper(){
    this.route.navigate(['/developer', this.developer.id]);
  }

  cargarUserLoged(){
    if (this.activatedRoute.snapshot.paramMap.get('userLoged') == "0") {
      this.userLoged.id = "0";
      this.userLoged.image = "https://firebasestorage.googleapis.com/v0/b/gamescore-f0cc0.appspot.com/o/error%20403.jpg?alt=media&token=90e17733-34c2-4914-8731-e14787939e72";
    } else {
      this.firebaseService.getUsuario(+this.activatedRoute.snapshot.paramMap.get('userLoged')-1).subscribe(
        (user: User) => {
          this.userLoged = user;
        }
      )
    }
    console.log(this.userLoged);
  }

  async presentModalUsuario() {
    const modal = await this.modalController.create({
      component: UserComponent, componentProps: {
        userLoged: this.userLoged
      }
    });
    return await modal.present();
  }

  goToSuggestions(){
    this.route.navigate(['/suggestions']);
  }
}

