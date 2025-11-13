import { AfterViewChecked, AfterViewInit, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { PokemonApi } from '../../services/pokemon-api';
import { Router, RouterLink, RouterLinkWithHref } from "@angular/router";
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
import { reduce } from 'rxjs';

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
  pokemonToFightHP = signal<number>(1)
  isFighting = signal<boolean>(false)
  message = signal<string>("")

  current_index = signal<number>(0)


  pokemonState = "visible"
  pokeballState = "rest"

  constructor(private router: Router) { }

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
        this.gameService.team.update(team => team.map(p => p.id == this.previous_pokemon()!.id ? next_pokemon! : p))
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
      return false
    }
    //console.log("all captured :", this.gameService.pokeBank())

    this.evolve()

    this.randomPokemon()
    return true
  }

  changePokemon(id: number) {
    console.log("previous index : ", this.current_index())
    let new_index = null
    this.gameService.team().find((p, i) => { if (p.id == id) { new_index = i } })
    this.current_index.set(new_index!)
    console.log("next index: ", this.current_index())
  }

  onPokeballEnd() {
    this.pokemonState = "caught"
  }

  close() {
    this.isEvolving.set(false)
    this.previous_pokemon.set(null)
  }

  close2() {
    this.isFighting.set(false)
  }

  fightPokemon() {
    this.pokemonToFightHP.set(this.pokemonToFight()!.stats.HP)
    this.isFighting.set(true)
  }

  run() {
    if (Math.random() < 0.5) {
      this.randomPokemon()
    } else {
      const damage = this.attacked(this.pokemonToFight()!, this.gameService.team()[this.current_index()])
      this.gameService.teamHealthPoint.update(teamHP => teamHP.map((pHP, idx) => idx == this.current_index() ? Math.floor(pHP - damage) : pHP))
    }
  }

  catch() {
    if (!this.capturePokemon()) {
      alert("fail to catch")
      const damage = this.attacked(this.pokemonToFight()!, this.gameService.team()[this.current_index()])
      this.gameService.teamHealthPoint.update(teamHP => teamHP.map((pHP, idx) => idx == this.current_index() ? Math.floor(pHP - damage) : pHP))

    }
  }


  attacked(attacker: IPokemon, target: IPokemon) {
    const base_dmg = 10
    const base_def = 5
    //const pokemon_team = this.gameService.team()[this.current_index()]
    //const wild_pokemon = this.pokemonToFight()!
    const damage_res1 = (base_dmg + base_dmg * attacker.stats.attack / 100)
    // console.log(damage_res1)
    const damage_res0 = damage_res1 + damage_res1 * attacker.stats.special_attack / 100
    // console.log(damage_res0)
    const damage_reduced1 = (base_def + base_def * target.stats.defense / 100)
    // console.log(damage_reduced1)
    const damage_reduced0 = damage_reduced1 + damage_reduced1 * target.stats.special_defense / 100
    // console.log(damage_reduced0)
    const damage_dealt = damage_res0 - damage_reduced0
    // console.log(Math.round(damage_dealt))
    return damage_dealt


  }

  attackPokemon() {
    const base_dmg = 10
    const base_def = 5
    const pokemon_team = this.gameService.team()[this.current_index()]
    const wild_pokemon = this.pokemonToFight()!


    const damage_dealt = this.attacked(pokemon_team, wild_pokemon)
    const damage_dealt2 = this.attacked(wild_pokemon, pokemon_team)
    // const damage_res1 = (base_dmg+ base_dmg*pokemon_team.stats.attack/100)
    // // console.log(damage_res1)
    // const damage_res0 = damage_res1 + damage_res1*pokemon_team.stats.special_attack/100
    // // console.log(damage_res0)
    // const damage_reduced1 = (base_def + base_def*wild_pokemon.stats.defense/100)
    // // console.log(damage_reduced1)
    // const damage_reduced0= damage_reduced1 + damage_reduced1*wild_pokemon.stats.special_defense/100
    // // console.log(damage_reduced0)
    // const damage_dealt = damage_res0 - damage_reduced0
    // // console.log(Math.round(damage_dealt))


    // const damage_res2 = (base_dmg+ base_dmg*wild_pokemon.stats.attack/100)
    // // console.log(damage_res2)
    // const damage_res3 = damage_res2 + damage_res2*wild_pokemon.stats.special_attack/100
    // // console.log(damage_res3)
    // const damage_reduced2 = (base_def + base_def*pokemon_team.stats.defense/100)
    // // console.log(damage_reduced2)
    // const damage_reduced3= damage_reduced2 + damage_reduced2*pokemon_team.stats.special_defense/100
    // // console.log(damage_reduced0)
    // const damage_dealt2 = damage_res3 - damage_reduced3
    // // console.log(Math.round(damage_dealt2))

    console.log("team hp before : ", this.gameService.teamHealthPoint())

    this.gameService.teamHealthPoint.update(teamHP => teamHP.map((pHP, idx) => idx == this.current_index() ? Math.floor(pHP - damage_dealt) : pHP))
    console.log("team hp after : ", this.gameService.teamHealthPoint())
    console.log("wild hp before : ", this.pokemonToFightHP())
    this.pokemonToFightHP.update(hp => hp - Math.floor(damage_dealt2))
    console.log("wild hp after : ", this.pokemonToFightHP())


    this.checkHealth()
    // if (this.pokemonToFightHP() <= 0) {

    //   alert(`you win : ${wild_pokemon.name} died`)
    //   this.close2()
    //   this.evolve()
    //   this.randomPokemon()
    // }

    // if (this.gameService.teamHealthPoint()[this.current_index()] <= 0) {
    //   this.gameService.pokeBank.set(this.gameService.pokeBank().filter(p => p.id != this.gameService.team()[this.current_index()].pokedexId))
    //   this.gameService.removeFromTeam(this.gameService.team()[this.current_index()].id)

    //   alert("ho no you let one of your pokemon died !")
    //   //this.close2()


    // }

    // if (this.gameService.team().length < 1) {
    //   this.close2()
    //   this.isFighting.set(false)


    //   if (this.gameService.pokeBank().length < 1) {
    //     alert("go back to your mom choose another starter , you killed all your pokemon !!!")
    //     this.gameService.resetGame()
    //     this.router.navigate(["/"])
    //   } else {
    //     this.gameService.addToTeam(this.gameService.pokeBank()[0].id)
    //     this.router.navigate(["/layout/pokedex"])
    //   }
    // }


  }

  checkHealth() {
    if (this.pokemonToFightHP() <= 0) {

      alert(`you win : ${this.pokemonToFight()!.name} died`)
      this.close2()
      this.evolve()
      this.randomPokemon()
    }

    if (this.gameService.teamHealthPoint()[this.current_index()] <= 0) {
      this.gameService.pokeBank.set(this.gameService.pokeBank().filter(p => p.id != this.gameService.team()[this.current_index()].pokedexId))
      this.gameService.removeFromTeam(this.gameService.team()[this.current_index()].id)

      alert("ho no you let one of your pokemon died !")
      //this.close2()


    }

    // if (this.gameService.team().length < 1) {
    if (this.gameService.teamHealthPoint().filter(hp=>hp>0).length < 1) {
      this.close2()
      this.isFighting.set(false)


      if (this.gameService.pokeBank().length < 1) {
        alert("go back to your mom choose another starter , you killed all your pokemon !!!")
        this.gameService.resetGame()
        this.router.navigate(["/"])
      } else {
        this.gameService.addToTeam(this.gameService.pokeBank()[0].id)
        this.router.navigate(["/layout/pokedex"])
      }
    }

  }
}
