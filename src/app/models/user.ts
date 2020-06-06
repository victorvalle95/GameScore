import { first } from 'rxjs-compat/operator/first';

export class User{
    first_name: string;
    last_name: string;
    image: string;
    username: string;
    password: string;
    email: string;
    id_media: string;
    id: string;
    tlf: string;

    constructor(){
        this.first_name = "";
        this.last_name = "";
        this.image = "";
        this.username = "",
        this.password = "";
        this.email = "";
        this.id_media = "";
        this.id = "";
        this.tlf = "";
    }
}