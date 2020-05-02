import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { Game } from '../models/game';
import { Critic } from '../models/critic';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit {

  games: Game[] = [];
  upcomingGames: Game[] = [];
  halfOfFameGames: Game[] = [];
  critics: Critic[] = [];
  mediaScore: string;
  actualGames: Game[] = [];
  slideshowImages: String[] = [];
  slideshowImages2: String[] = [];
  fechaActual: Date = new Date();


  constructor(
    public firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.cargarDatosEnCascada();
  }

  color(value: Game) {
    if (+value.mediaScore < 50) {
      return 'danger';

    }
    return 'success';
  }

  cargarDatosEnCascada() {
    //lo hacemos así por la asincronía
    this.firebaseService.getGames().subscribe((data: any) => {
      let gamesAux = data;
      this.firebaseService.getCritics().subscribe((data2: any) => {
        this.critics = data2;
        gamesAux.forEach((game: Game) => {
          //de momento supondremos que todos los usuarios sean media
          let score: number = 0;
          let contador = 0;
          this.critics.forEach((critic: Critic) => {
            if (critic.id_game == game.id) {
              score += Math.round(+critic.score);
              contador += 1;
            }
          });
          game.mediaScore = "" + Math.trunc(score / contador);
          game.releaseDate = new Date(game.releaseDateBD);
          game.releaseDateText = this.textDate(game.releaseDate);

          this.actualUpcomingDivision(game);

          this.games.push(game);
        });

        this.actualGames.forEach((game: Game) => {
          this.slideshowImages.push(game.image);
        });

        this.halfofFameActualYear();

        this.halfOfFameGames = this.games.sort((a, b) => {
          if (a.mediaScore < b.mediaScore) {
            return 1;
          } else if (a.mediaScore > b.mediaScore) {
            return -1;
          }
        });

        console.log(this.games);
      });

    });

  }


  textDate(date: Date) {
    //Asi es como se mostrará en la lista el tiempo que le queda para salir
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' });
  }

  actualUpcomingDivision(game) {
    if (game.releaseDate.getTime() > Date.now()) {
      this.upcomingGames.push(game);
    }
    else if (Date.now() - game.releaseDate.getTime() < 7776000000) {
      console.log(Date.now() - game.releaseDate.getTime())
      this.actualGames.push(game);
      this.actualGames = this.actualGames.sort((a, b) => {
        if (a.releaseDate < b.releaseDate) {
          return 1;
        }
        if (a.releaseDate > b.releaseDate) {
          return -1;
        }
        return 0;
      }).slice(0, 5);
    }
  }

  halfofFameActualYear() {
    this.games.forEach(
      (game) => {
        if (game.releaseDate.getFullYear() == new Date().getFullYear() && +game.mediaScore > 50) {//cambiar el 50
          this.halfOfFameGames.push(game);
        }
      }
    );
    this.halfOfFameGames.sort((a, b) => {
      if (a.mediaScore < b.mediaScore) {
        return 1;
      }
      if (a.mediaScore > b.mediaScore) {
        return -1;
      }
      return 0;
    });

    this.halfOfFameGames.forEach(
      (game2) => {
        this.slideshowImages2.push(game2.image);
      }
    )

  }

}
