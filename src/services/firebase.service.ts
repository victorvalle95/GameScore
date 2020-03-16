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

  public getMedia(){
    return this.afDB.list('media_companies/').valueChanges();
  }
}