import { Component, inject, OnInit, signal } from '@angular/core';
import { Route, Router, RouterLink } from "@angular/router";
import { Game } from '../../services/game';
import { PokemonApi } from '../../services/pokemon-api';
import { FormsModule } from '@angular/forms';
import { IPokemon } from '../../interfaces/ipokemon';

@Component({
  selector: 'app-starter',
  imports: [RouterLink, FormsModule],
  templateUrl: './starter.html',
  styleUrl: './starter.css',
})
export class Starter implements OnInit {
  //starter_id = [1,4,7]
  gameService = inject(Game)
  apiService = inject(PokemonApi)
  //pokemons = signal([])

  pokemonChosen = signal<IPokemon | null>(null)

  starter = this.starterPokemon()

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.gameService.loadGame()) {
      this.router.navigate(["/layout/encounter"])
    }
  }
  starterPokemon() {
    //return this.starter_id.map(id=>this.pokemonApi.getPokemonById(id))
    return this.apiService.getStarters()

  }
  choosePokemon(id: number) {

    //if (!this.gameService.loadGame()){


    //const pokemon = this.apiService.getPokemonById(id)
    console.log("choosing pokemon : ", id)
    const pokemon = this.starter().find(p => p.id == id)
    this.gameService.addToSeen(pokemon!)
    this.gameService.capturePokemon(pokemon!)
    //this.gameService.addToTeam(id)
    // }else{
    //   console.log("finded settings !")
    // }
  }
  importGame() {
 // trigger the hidden input
    const input: HTMLElement | null = document.querySelector(
      'input[type="file"]'
    );
    input?.click();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedData = JSON.parse(reader.result as string);
        this.gameService.loadGame(importedData); // ✅ you need to implement this
        console.log('Game imported!', importedData);
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
    };

    reader.readAsText(file);
  }



}
