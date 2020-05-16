import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Game } from "../models/game";
import { FirebaseService } from "src/services/firebase.service";
import { Critic } from "../models/critic";

@Component({
  selector: "app-game",
  templateUrl: "./game.page.html",
  styleUrls: ["./game.page.scss"],
})
export class GamePage implements OnInit {
  game: Game = new Game();
  userCritics: Critic[];
  mediaCritics: Critic[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.firebaseService
      .getGame(this.activatedRoute.snapshot.paramMap.get("idGame"))
      .subscribe((data: Game) => {
        this.game = data;
        this.mediaCritics = this.firebaseService.getMediaCritics(data.id);
        this.userCritics = this.firebaseService.getUserCritics(data.id);
        console.log(this.userCritics);
        console.log(this.mediaCritics);

        
      });
  }
}
