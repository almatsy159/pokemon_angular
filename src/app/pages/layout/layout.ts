import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Game } from '../../services/game';
import { PokemonApi } from '../../services/pokemon-api';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  gameService = inject(Game)
  pokemonApi = inject(PokemonApi)
  //totalCaptured = signal(0)
  completionPercentage = computed(()=>this.gameService.totalCaptured()/this.pokemonApi.total_gen*100)


  resetGame(){
    this.gameService.resetGame()
  }

  exportGame(){
    const game = this.gameService.gameData()
    console.log(game)



const jsonString = JSON.stringify(game, null, 2);

// Create a Blob from JSON
const blob = new Blob([jsonString], { type: "application/json" });

// Create a download link
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "data.json";

// Trigger the download
link.click();

  }
  

}
