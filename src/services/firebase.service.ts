import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs-compat";
import { User } from "src/app/models/user";
import { Game } from "src/app/models/game";
import { Critic } from "src/app/models/critic";
import { Genre } from 'src/app/models/genre';

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  mediaCritics: Critic[] = [];
  userCritics: Critic[] = [];
  userScore: string;
  mediaScore: string;

  constructor(public afDB: AngularFireDatabase) { }

  public getUsuarios() {
    return this.afDB.list("users/").valueChanges();
    //Esta función devolverá todos los datos que tengamos en el apartado usuarios, en nuestra base de datos
  }
  public saveUsuario(user: User, length) {
    user.id = length+1;
    this.afDB.database.ref("users/" + (length)).set(user);
  }
  public updateUsuario(usuario) {
    //Actualizamos la fruta con el id que recibimos del objeto del parametro
    this.afDB.database.ref("users/" + usuario.id).set(usuario);
  }
  public getUsuario(id) {
    return this.afDB.object("users/" + id).valueChanges();
    //Devolvera el usuario con el id que le pasamos por parametro
  }
  public removeUsuario(id) {
    this.afDB.database.ref("users/" + id).remove();
    //Borrará el usuario con el id que le pasamos por parametro
  }

  public getGames() {
    return this.afDB.list("games/").valueChanges();
  }
  public saveGame(game: Game, length) {
    game.id = length;
    this.afDB.database.ref("games/" + game.id).set(game);
  }
  public updateGame(usuario) {
    this.afDB.database.ref("games/" + usuario.id).set(usuario);
  }
  public getGame(id) {
    return this.afDB.object("games/" + (id)).valueChanges();
  }
  public removeGame(id) {
    this.afDB.database.ref("games/" + id).remove();
  }

  public getCritics() {
    return this.afDB.list("critics/").valueChanges();
  }
  public saveCritic(critic: Critic, length) {
    critic.id = ""+length;
    this.afDB.database.ref("critics/" + critic.id).set(critic);
  }
  public updateCritic(critic) {
    this.afDB.database.ref("critics/" + critic.id).set(critic);
  }
  public getCritic(id) {
    return this.afDB.object("critics/" + id).valueChanges();
  }
  public removeCritic(id) {
    this.afDB.database.ref("critics/" + id).remove();
  }

  public getUserScore(idGame) {
    //this.getUserCritics(idGame);
    return this.userScore;
  }

  public getMediaScore(idGame) {
    //this.getMediaCritics(idGame);
    return this.mediaScore;
  }

  public getDirectors() {
    return this.afDB.list("directors/").valueChanges();
  }
  public saveDirector(critic: Critic, length) {
    critic.id = length;
    this.afDB.database.ref("directors/" + critic.id).set(critic);
  }
  public updateDirector(usuario) {
    this.afDB.database.ref("directors/" + usuario.id).set(usuario);
  }
  public getDirector(id) {
    return this.afDB.object("directors/" + id).valueChanges();
  }

  public removeDirector(id) {
    this.afDB.database.ref("directors/" + id).remove();
  }

  public getDevelopers() {
    return this.afDB.list("developers/").valueChanges();
  }
  public saveDeveloper(critic: Critic, length) {
    critic.id = length;
    this.afDB.database.ref("developers/" + critic.id).set(critic);
  }
  public updateDeveloper(usuario) {
    this.afDB.database.ref("developers/" + usuario.id).set(usuario);
  }
  public getDeveloper(id) {
    return this.afDB.object("developers/" + id).valueChanges();
  }
  public removeDeveloper(id) {
    this.afDB.database.ref("developers/" + id).remove();
  }

  public getPublishers() {
    return this.afDB.list("publishers/").valueChanges();
  }
  public savePublisher(critic: Critic, length) {
    critic.id = length;
    this.afDB.database.ref("publishers/" + critic.id).set(critic);
  }
  public updatePublisher(usuario) {
    this.afDB.database.ref("publishers/" + usuario.id).set(usuario);
  }
  public getPublisher(id) {
    return this.afDB.object("publishers/" + id).valueChanges();
  }
  public removePublisher(id) {
    this.afDB.database.ref("publishers/" + id).remove();
  }

  public getGenres() {
    return this.afDB.list("genres/").valueChanges();
  }
  public saveGenre(genre: Genre, length) {
    genre.id = length;
    this.afDB.database.ref("genres/" + genre.id).set(genre);
  }
  public updateGenre(genre) {
    this.afDB.database.ref("genres/" + genre.id).set(genre);
  }
  public getGenre(id) {
    return this.afDB.object("genres/" + id).valueChanges();
  }
  public removeGenre(id) {
    this.afDB.database.ref("genres/" + id).remove();
  }
}
