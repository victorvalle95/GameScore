import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { Game } from '../models/game';
import { Critic } from '../models/critic';
import { Director } from '../models/director';
import { Developer } from '../models/developer';
import { Publisher } from '../models/publisher';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { MenuController, ModalController } from '@ionic/angular';
import { UserComponent } from '../user/user.component';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit {

  paramUserLoged: string;
  userLoged: User = new User();

  games: Game[] = []; // Todos los juegos
  upcomingGames: Game[] = []; // Juegos que aún no han salido
  actualYearGames: Game[] = []; //Juegos del año en curso
  actualGames: Game[] = []; // con menos de 90 días

  directors: Director[];
  publishers: Publisher[];
  developers: Developer[];

  critics: Critic[] = [];
  mediaScore: string;

  fechaActual: Date = new Date();

  mainControl: Boolean = true;
  actualYearControl: Boolean = false;
  searchControl: Boolean = false;

  selectSearch: string = "games";
  searchedGames: Game[];
  searchedDirectors: Director[];
  searchedDevelopers: Developer[];
  searchedPublishers: Publisher[];

  constructor(
    public firebaseService: FirebaseService,
    public route: Router,
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.cargarDatosEnCascada();
    this.cargarUserLoged();

  }

  cargarDatosEnCascada() {
    //lo hacemos así por la asincronía
    this.firebaseService.getGames().subscribe((data: Game[]) => {
      console.log(data);
      this.firebaseService.getCritics().subscribe((data2: Critic[]) => {
        this.critics = data2;
        data.forEach((game: Game) => {
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

            this.actualUpcomingDivision(game);

            this.games.push(game);
          }
            , 1000);
        });

        setTimeout(() => {
          //ordenamos listas
          this.actualYearGamesSelection();

          this.games = this.orderByScore(this.games);
          this.actualGames = this.orderByScore(this.actualGames);


          this.actualYearGames = this.orderByScore(this.actualYearGames);
          this.searchedGames = this.games;

          this.firebaseService.getDirectors().subscribe(
            (data: Director[]) => {
              this.directors = data;
              console.log(this.directors);
              this.directors = this.orderByText(this.directors);
              this.searchedDirectors = this.directors;
            }
          );

          this.firebaseService.getPublishers().subscribe(
            (data2: Publisher[]) => {
              this.publishers = data2;
              this.publishers = this.orderByText(this.publishers);
              this.searchedPublishers = this.publishers;
            }
          );

          this.firebaseService.getDevelopers().subscribe(
            (data3: Developer[]) => {
              this.developers = data3;
              this.developers = this.orderByText(this.developers);
              this.searchedDevelopers = this.developers;
            }
          );
          console.log(this.games);

        }, 1500);
      });
    });
  }

  color(value: Game) {

    if (+value.mediaScore < 50) {
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

  textDate(date: Date) {
    //Asi es como se mostrará en la lista el tiempo que le queda para salir
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' });
  }

  actualUpcomingDivision(game: Game) {
    if (game.releaseDateBD == "TBD" || game.releaseDate.getTime() > Date.now()) {
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

  actualYearGamesSelection() {
    this.games.forEach(
      (game) => {

        if (game.releaseDate && game.releaseDate.getFullYear() == new Date().getFullYear() && game.releaseDate <= new Date()) {//cambiar el 50
          this.actualYearGames.push(game);
        }
      }
    );
    this.actualYearGames.sort((a, b) => {
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

  orderByText(values) {
    values.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });

    return values;

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

  search(event) {
    console.log(event);
    console.log(this.selectSearch);
    if (this.selectSearch == "games") {
      this.searchGame(event.detail.value);
    } else if (this.selectSearch == "directors") {
      this.searchDirector(event.detail.value);
    } else if (this.selectSearch == "developers") {
      this.searchDeveloper(event.detail.value);
    } else if (this.selectSearch == "publishers") {
      this.searchPublisher(event.detail.value);
    }
  }

  searchGame(event: string) {
    if (event == "") {
      this.searchedGames = [];
      this.searchedGames.values = this.games.values;
    } else {
      this.searchedGames = [];
    }

    this.games.forEach(
      (game: Game) => {
        if (game.name.toUpperCase().includes(event.toUpperCase())) {
          this.searchedGames.push(game);
        }
      }
    )
    this.orderByScore(this.searchedGames);
    console.log(this.searchedGames)
  }

  searchDirector(event: string) {
    if (event == "") {
      this.searchedDirectors = [];
      this.searchedDirectors.values = this.directors.values;

    } else {
      this.searchedDirectors = [];
    }

    this.directors.forEach(
      (director: Director) => {
        if (director.name.toUpperCase().includes(event.toUpperCase())) {
          this.searchedDirectors.push(director);
        }
      }
    )
    console.log(this.directors);
  }

  searchDeveloper(event: string) {
    if (event == "") {
      this.searchedDevelopers = [];
      this.searchedDevelopers.values = this.developers.values;

    } else {
      this.searchedDevelopers = [];
    }

    this.developers.forEach(
      (developer: Developer) => {
        if (developer.name.toUpperCase().includes(event.toUpperCase())) {
          this.searchedDevelopers.push(developer);
        }
      }
    )
    console.log(this.developers);
  }


  searchPublisher(event: string) {
    if (event == "") {
      this.searchedPublishers = [];
      this.searchedPublishers.values = this.publishers.values;

    } else {
      this.searchedPublishers = [];
    }

    this.publishers.forEach(
      (publisher: Publisher) => {
        if (publisher.name.toUpperCase().includes(event.toUpperCase())) {
          this.searchedPublishers.push(publisher);
        }
      }
    )
    console.log(this.publishers);
  }

  changeSelectSearch(selectSearch: string) {
    this.selectSearch = selectSearch;
    console.log(this.selectSearch);
  }

  goToGame(idGame: string) {
    this.route.navigate(['/game', this.userLoged.id,idGame]);
  }

  goToDirector(idDirector: string) {
    this.route.navigate(['/director',this.userLoged.id, idDirector]);
  }

  goToPublisher(idPublisher: string) {
    this.route.navigate(['/publisher',this.userLoged.id, idPublisher]);
  }

  goToDeveloper(idDeveloper: string) {
    this.route.navigate(['/developer',this.userLoged.id, idDeveloper]);
  }

  async presentModalUsuario() {
    const modal = await this.modalController.create({
      component: UserComponent, componentProps: {
        userLoged: this.userLoged
      }
    });
    return await modal.present();
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
  }

  goToSuggestions(){
    this.route.navigate(['/suggestions']);
  }
}
