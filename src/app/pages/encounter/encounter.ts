import { AfterViewChecked, AfterViewInit, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { PokemonApi } from '../../services/pokemon-api';
import { RouterLink, RouterLinkWithHref } from "@angular/router";
import { IPokemon } from '../../interfaces/ipokemon';
import { toSignal } from '@angular/core/rxjs-interop';
import { Game } from '../../services/game';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations'

@Component({
  selector: 'app-encounter',
  imports: [RouterLink],
  templateUrl: './encounter.html',
  styleUrl: './encounter.css',
  animations: [

    // Pokémon fade out
    trigger('pokemonState', [
      state('visible', style({ opacity: 1 })),
      state('caught', style({ opacity: 0 })),
      transition('visible => caught', [
        animate('500ms ease-out')
      ])
    ]),

    // Pokéball throw animation
    trigger('pokeballThrow', [
      state('rest', style({ transform: 'translate(0,0) scale(1)' })),
      state('throw', style({ transform: 'translate(120px,-120px) scale(1.2)' })),

      // Add curve + shake
      transition('rest => throw', [
        animate(
          '900ms ease-out',
          keyframes([
            style({ transform: 'translate(0,0) scale(1)', offset: 0 }),
            style({ transform: 'translate(60px,-80px) scale(1.1)', offset: 0.5 }),
            style({ transform: 'translate(120px,-120px) scale(1.2)', offset: 1 })
          ])
        )
      ])
    ])]
})
export class Encounter implements OnInit {
  apiService = inject(PokemonApi)
  gameService = inject(Game)

  //pokemonToFight = toSignal(this.apiService.getRandomGenXPokemon())
  pokemonToFight = signal<IPokemon | null>(null)
  message = signal<string>("")

  current_index = signal<number>(0)


  pokemonState = "visible"
  pokeballState = "rest"

  allPokemon = this.apiService.getGenXPokemon()

  // attempt = signal<number>(0)
  //attempt = signal(this.gameService.attempt())
  attempt = computed<number>(() => this.gameService.attempt())
  isEvolving = signal<boolean>(false)
  previous_pokemon = signal<IPokemon | null>(null)

  randomPokemon() {
    if (this.gameService.choosenStarter() == false) {
      this.gameService.choosenStarter.set(true)
    }
    this.apiService.getRandomGenXPokemon().subscribe({
      next: (value) => {
        //console.log(value)
        this.pokemonToFight.set(value)
      }
    })
    if (this.pokemonToFight()) {
      this.gameService.addToSeen(this.pokemonToFight()!)
    }
    //console.log("pokemon seen : ", this.gameService.pokemonSeen())
  }

  ngOnInit(): void {
    this.randomPokemon()
  }

  evolve() {
    // should place that on current index !!
    // bug on team size during evolve ...
    let index = 0
    if (this.gameService.team()[this.current_index()].apiEvolutions.length > 0) {
      if (this.gameService.team()[this.current_index()].apiEvolutions.length > 1) {
        index = Math.floor(Math.random() * this.gameService.team()[this.current_index()].apiEvolutions.filter(p => p.pokedexId < 151).length)
      }

      if (Math.random() > 0.95) {
        console.log("evolved !!! ", index, this.gameService.team()[this.current_index()].apiEvolutions[index])
        this.previous_pokemon.set(this.gameService.team()[this.current_index()])
        this.isEvolving.set(true)

        const next_pokemon = this.allPokemon().find(p => p.id == this.gameService.team()[this.current_index()].apiEvolutions[index].pokedexId)
        this.gameService.pokeBank.set(this.gameService.pokeBank().filter(p => p.id != this.gameService.team()[this.current_index()].pokedexId))
        //this.gameService.removeFromTeam(this.gameService.team()[0].id)

        if (!this.gameService.pokeBank().find(p => p.id == next_pokemon!.id)) {
          console.log("not finded in bank => capture and add to seen")
          //this.gameService.capturePokemon(next_pokemon!)
          this.gameService.addToBank(next_pokemon!)
          this.gameService.addToSeen(next_pokemon!)

        } else {
          console.log("finded in bank so adding to team")
          this.gameService.addToTeam(next_pokemon!.id)
        }
        //console.log("swapping pos")
        //this.gameService.swapLastAndFirst()
        this.gameService.team.update(team=>team.map(p=>p.id==this.previous_pokemon()!.id?next_pokemon!:p))
        this.gameService.storeGame()

      } else {
        console.log("didn't evolve")
      }
    } else {
      console.log("doesn't have evolution !")
    }
  }

  capturePokemon() {
    // this.pokeballState = "throw"
    this.gameService.attempt.update(v => v + 1)
    this.gameService.storeAttempt()
    //console.log("seen pokemon", this.gameService.pokemonSeen())
    const captured = Math.random() < 0.5
    if (captured) {
      this.message.set(`✅ Bravo ! Tu as capturé ${this.pokemonToFight()!.name} !`)
      const result = this.gameService.capturePokemon(this.pokemonToFight()!)
      console.log("captured : ", this.pokemonToFight())
      this.message.update(message => message + result)

    } else {
      this.message.set(`❌ ${this.pokemonToFight()!.name} s'est échappé !`)
    }
    //console.log("all captured :", this.gameService.pokeBank())

    this.evolve()

    this.randomPokemon()

  }

  changePokemon(id: number) {
    console.log("previous index : ",this.current_index())
    let new_index = null
    this.gameService.team().find((p, i) => { if (p.id == id) { new_index = i } })
    this.current_index.set(new_index!)
    console.log("next index: ",this.current_index())
  }

  onPokeballEnd() {
    this.pokemonState = "caught"
  }

  close() {
    this.isEvolving.set(false)
    this.previous_pokemon.set(null)
  }
}
