import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs-compat';
import { User } from 'src/app/models/user';
import { Game } from 'src/app/models/game';
import { Critic } from 'src/app/models/critic';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor(public afDB: AngularFireDatabase) {

  }

  public getUsuarios() {
    return this.afDB.list('users/').valueChanges();
    //Esta función devolverá todos los datos que tengamos en el apartado usuarios, en nuestra base de datos
  }
  public saveUsuario(user:User,length) {
      user.id = length;
      this.afDB.database.ref('users/' + user.id).set(user);
  }
  public updateUsuario(usuario) {
    //Actualizamos la fruta con el id que recibimos del objeto del parametro
    this.afDB.database.ref('users/' + usuario.id).set(usuario);
  }
  public getUsuario(id) {
    return this.afDB.object('users/' + id).valueChanges();
    //Devolvera el usuario con el id que le pasamos por parametro
  }
  public removeUsuario(id) {
    this.afDB.database.ref('users/' + id).remove();
    //Borrará el usuario con el id que le pasamos por parametro
  }


  public getGames() {
    return this.afDB.list('games/').valueChanges();
  }
  public saveGame(game:Game,length) {
      game.id = length;
      this.afDB.database.ref('games/' + game.id).set(game);
  }
  public updateGame(usuario) {
    this.afDB.database.ref('games/' + usuario.id).set(usuario);
  }
  public getGame(id) {
    return this.afDB.object('games/' + id).valueChanges();
  }
  public removeGame(id) {
    this.afDB.database.ref('games/' + id).remove();
  }

  public getCritics() {
    return this.afDB.list('critics/').valueChanges();
  }
  public saveCritic(critic:Critic,length) {
      critic.id = length;
      this.afDB.database.ref('critics/' + critic.id).set(critic);
  }
  public updateCritic(usuario) {
    this.afDB.database.ref('critics/' + usuario.id).set(usuario);
  }
  public getCritic(id) {
    return this.afDB.object('critics/' + id).valueChanges();
  }
  public removeCritic(id) {
    this.afDB.database.ref('critics/' + id).remove();
  }

  public getMedia(){
    return this.afDB.list('media_companies/').valueChanges();
  }
}