import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { Director } from '../models/director';
import { ActivatedRoute, Router } from '@angular/router';
import { Developer } from '../models/developer';
import { Game } from '../models/game';
import { Critic } from '../models/critic';
import { User } from '../models/user';
import { UserComponent } from '../user/user.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-director',
  templateUrl: './director.page.html',
  styleUrls: ['./director.page.scss'],
})
export class DirectorPage implements OnInit {

  director: Director = new Director();
  developer: Developer = new Developer();
  twitter: string;
  games: Game[] = [];
  critics: Critic[] = [];
  userLoged: User = new User();

  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public modalController: ModalController,

  ) { }

  ngOnInit() {
    this.firebaseService
      .getDirector(+this.activatedRoute.snapshot.paramMap.get("idDirector") - 1)
      .subscribe((dataDirector: Director) => {
        this.director = dataDirector;
        this.twitter = "http://twitter.com/" + this.director.twitter;
        this.firebaseService.getDeveloper(+this.director.id_developerActual - 1).subscribe(
          (developer: Developer) => {
            this.developer = developer;
            this.firebaseService.getGames().subscribe(
              (gamesData: Game[]) => {
                gamesData.forEach(
                  (game: Game) => {
                    if (game.id_director == this.director.id) {
                      let control = true;
                      this.games.forEach((game2) => {
                        if (game2.id == game.id) {
                          control = false;
                        }
                      });
    
                      if (control == true) {
                        this.games.push(game);
                      }                      this.firebaseService.getCritics().subscribe((data2: Critic[]) => {
                        this.critics = data2;
                        gamesData.forEach((game: Game) => {
                          //de momento supondremos que todos los usuarios sean media
                          let score: number = 0;
                          let contador = 0;
                          this.critics.forEach((critic: Critic) => {
                            this.firebaseService.getUsuario(+critic.id_user - 1).subscribe(
                              (user: User) => {
                                if (user.id_media != "0") {
                                  if (critic.id_game == game.id) {
                                    score += Math.round(+critic.score);
                                    contador += 1;
                                  }
                                }
                              }
                            );
                          });
                          setTimeout(() => {
                            game.mediaScore = "" + Math.trunc(score / contador);
                            if (game.mediaScore == "NaN") {
                              game.mediaScore = "--";
                            } else if (game.mediaScore.length < 2) {
                              game.mediaScore = "0" + game.mediaScore;
                            }
                            if (game.releaseDateBD != "TBD") {
                              game.releaseDate = new Date(game.releaseDateBD);
                              game.releaseDateText = this.textDate(game.releaseDate);
                            } else {
                              game.releaseDateText = "TBD";
                            }

                            if (game.releaseDateBD == "TBD" || game.releaseDate.getTime() > Date.now()
                            ) {
                              game.mediaScore = "--";
                            }
                            this.cargarUserLoged();
                          }
                            , 1000);

                        });
                      });
                    };

                  }
                );
              });
          }
        );
      });
  }

  textDate(date: Date) {
    //Asi es como se mostrará en la lista el tiempo que le queda para salir
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) +' '+ date.toLocaleString('default', {year: 'numeric'});
  }

  async presentModalUsuario() {
    const modal = await this.modalController.create({
      component: UserComponent, componentProps: {
        userLoged: this.userLoged
      }
    });
    return await modal.present();
  }

  color(value: Game) {
    if (+ value.mediaScore < 50) {
      return 'danger';
    } else if (+value.mediaScore < 75) {
      return 'warning';
    } else if (+value.mediaScore < 85) {
      return 'success';
    } else if (+value.mediaScore < 101) {
      return 'favorite';
    }
    else {
      return 'medium';
    }
  }

  goToDeveloper() {
    this.route.navigate(['/developer', this.userLoged.id, this.developer.id]);
  }

  goToGame(idGame: string) {
    this.route.navigate(['/game', this.userLoged.id, idGame]);
  }

  orderByScore(games) {
    games.sort((a, b) => {
      if (a.mediaScore == '--') {
        return 1;
      } else if (b.mediaScore == '--') {
        return -1
      }
      else {
        if (+a.mediaScore < +b.mediaScore) {
          return 1;
        }
        if (+a.mediaScore > +b.mediaScore) {
          return -1;
        }
        return 0;
      }
    });
    return games;
  }

  cargarUserLoged() {
    if (this.activatedRoute.snapshot.paramMap.get('userLoged') == "0") {
      this.userLoged.id = "0";
      this.userLoged.image = "https://firebasestorage.googleapis.com/v0/b/gamescore-f0cc0.appspot.com/o/error%20403.jpg?alt=media&token=90e17733-34c2-4914-8731-e14787939e72";
    } else {
      this.firebaseService.getUsuario(+this.activatedRoute.snapshot.paramMap.get('userLoged') - 1).subscribe(
        (user: User) => {
          this.userLoged = user;
        }
      )
    }
  }
  
  goToSuggestions() {
    this.route.navigate(['/suggestions']);
  }
}
