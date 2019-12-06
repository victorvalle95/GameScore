import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs-compat';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  constructor(public afDB: AngularFireDatabase) {

  }

  public getUsuarios() {
    return this.afDB.list('user/').valueChanges();
    //Esta función devolverá todos los datos que tengamos en el apartado usuarios, en nuestra base de datos
  }
  public saveUsuario(user:User) {
    this.afDB.database.ref('usuarios/' + user.id).set(user);
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