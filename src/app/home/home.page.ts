import { Component } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {
  idSelected:any; //Esta variable se cargará cuando elijamos una fruta, así controlamos si es una fruta nueva o para actualizar
  show:boolean; //Esta variable contralará cuando queremos que se muestren los campos para introducir o actualizar una fruta
  fruits = []; //Array donde cargaremos las frutas que hay en la base de datos y las mostraremos en nuestra page
  fruit = {id:0, name:null, quantity:null}; //Declaramos un objeto vacio de fruta

  constructor( public fruitsService:FirebaseService) {
    this.show = false; //Inicializamos la variable a false, para que por defecto no se muestren los campos
    this.idSelected = 0; // Inicializamos a 0 idselected, que significará que no tenemos ninguna fruta existente selecionada.

    fruitsService.getUsuarios()
      .subscribe(fruits=>{
        this.fruits = fruits;
      });//Hacemos una llamada a nuestro servicio, al metodo getFruits y nos devolvera toda la fruta que hay en nuestr abase de datos
        // y las cargaremos en nuestro array
  }

  saveFruit(){
    if(this.idSelected != 0){//si es diferente a 0 actualizamos, sino creamos uno nuevo
      this.fruitsService.updateUsuario(this.fruit);
    }else{
      this.fruitsService.saveUsuario(this.fruit);
    }
    this.clear();
  }
  selectFruit(id){ //selecionamos una fruta y mostramos los campos
    this.show = true;
    this.idSelected = id;//cogemos su id

    let receivedFruit:any; //declaramos un objeto vacio que será el que reciba la información de la fruta que seleccionamos

    this.fruitsService.getUsuario(id)//hacemos uso de la funcion getfruit de nuestro servicio
    .subscribe(fruit=>{
      receivedFruit = fruit;//el objeto vacio recibe la variable
      this.fruit = receivedFruit;//Y se lo asignamos al objeto fruta los valores que se han retornado del servicio
    });
  }
  removeSelectedFruit(){
    //Llamamos a la funcion removeFruit de nuestro servicio, le pasamos el idselected y se borra esa fruta
    this.fruitsService.removeUsuario(this.idSelected);
    this.clear();
  }
  clear(){
    //inicializamos los valores de las variables una vez hecha una acción
    this.show = false;
    this.idSelected = 0;
    this.fruit.name = null;
    this.fruit.id = null;
    this.fruit.quantity  = null;
  }

}