import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor(public afDB: AngularFireDatabase) {

  }

  public getUsuarios() {
    return this.afDB.list('usuarios/').valueChanges();
    //Esta función devolverá todos los datos que tengamos en el apartado usuarios, en nuestra base de datos
  }
  public saveUsuario(usuario) {
    let key = this.afDB.list('/usuarios/').push(usuario).key;
    //Guardamos el usuario y obtenemos el id que firebase pone al nudulo de nuestro usuario.
    //Al guardarse sin id nuestro usuario, ahora la actualizamos con el id que firebase nos devuelve.
    usuario.id = key;
    this.afDB.database.ref('usuarios/' + usuario.id).set(usuario);

  }
  public updateUsuario(usuario) {
    //Actualizamos la fruta con el id que recibimos del objeto del parametro
    this.afDB.database.ref('usuarios/' + usuario.id).set(usuario);
  }
  public getUsuario(id) {
    return this.afDB.object('usuarios/' + id).valueChanges();
    //Devolvera el usuario con el id que le pasamos por parametro
  }
  public removeUsuario(id) {
    this.afDB.database.ref('usuarios/' + id).remove();
    //Borrará el usuario con el id que le pasamos por parametro
  }

}