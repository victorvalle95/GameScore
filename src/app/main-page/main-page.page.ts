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

  games: Game[] = []; // 
  upcomingGames: Game[] = []; // Juegos que aún no han salido
  halfOfFameGames: Game[] = []; //Hall de la fama
  actualGames: Game[] = []; // con menos de 90 días


  critics: Critic[] = [];
  mediaScore: string;

  fechaActual: Date = new Date();

  mainControl: Boolean = true;
  actualYearControl: Boolean = false;
  searchControl: Boolean = false;

  constructor(
    public firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.cargarDatosEnCascada();
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
          if (game.mediaScore == "NaN") {
            game.mediaScore = "-";
          } else if (game.mediaScore.length < 2) {
            game.mediaScore = "0" + game.mediaScore;
          }
          game.releaseDate = new Date(game.releaseDateBD);
          game.releaseDateText = this.textDate(game.releaseDate);

          this.actualUpcomingDivision(game);

          this.games.push(game);
        });

        //ordenamos listas
        this.games = this.orderByScore(this.games);
        this.actualGames = this.orderByScore(this.actualGames);

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

  color(value: Game) {
    if (value.mediaScore == "-") {
      return 'medium'
    }
    else if (+value.mediaScore < 50) {
      return 'danger';
    } else if (+value.mediaScore < 75) {
      return 'warning';
    } else {
      return 'success';
    }
  }


  textDate(date: Date) {
    //Asi es como se mostrará en la lista el tiempo que le queda para salir
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' });
  }

  actualUpcomingDivision(game: Game) {
    if (game.releaseDate.getTime() > Date.now() || game.releaseDateBD == "TBD") {
      this.upcomingGames.push(game);
    }

    else if (Date.now() - game.releaseDate.getTime() < 7776000000) { //90 días = 7776000000
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
      });
    }
  }

  halfofFameActualYear() {
    this.games.forEach(
      (game) => {
        if (game.releaseDate.getFullYear() == new Date().getFullYear() && game.releaseDate <= new Date() && +game.mediaScore > 50) {//cambiar el 50
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

  }

  orderByScore(games) {
    games.sort((a, b) => {
      if (a.mediaScore.length > 1) {
        if (+a.mediaScore < +b.mediaScore) {
          return 1;
        }
        if (+a.mediaScore > +b.mediaScore) {
          return -1;
        }
      }
      return 0;
    });
    return games;
  }


  changeTab(number) {
    if (number == "1") {
      this.mainControl = true;
      this.actualYearControl = false;
      this.searchControl = false;
    } else if (number == "2") {
      this.mainControl = false;
      this.actualYearControl = true;
      this.searchControl = false;
    } else if (number == "3") {
      this.mainControl = false;
      this.actualYearControl = false;
      this.searchControl = true;
    }
  }

}
