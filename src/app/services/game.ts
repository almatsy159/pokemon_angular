import { computed, effect, inject, Injectable, Signal, signal, TemplateRef } from '@angular/core';
import { IGame, IPokemon } from '../interfaces/ipokemon';
import { PokemonApi } from './pokemon-api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Game {
  team = signal<IPokemon[]>([])
  teamSize = computed(() => this.team().length)
  teamHealthPoint = signal<number[]>([])

  apiService = inject(PokemonApi)
  pokemonToAdd = signal<IPokemon | null>(null)

  // totalCaptured = signal<number>(0)
  pokeBank = signal<IPokemon[]>([])
  totalCaptured = computed<number>(()=>this.pokeBank().length)
  pokemonSeen = signal<IPokemon[]>([])
  choosenStarter = signal<boolean>(false)

  allPokemon = this.apiService.getGenXPokemon()
  attempt = signal<number>(this.loadCpt())
  current_gen = signal<number>(1)

  gameStorage = computed(()=>{
    const game = {
      captured : this.pokeBank().map(p=>p.id),
      team : this.team().map(p=>p.id),
      seen : this.pokemonSeen().map(p=>p.id),
      attempt : this.attempt(),
      team_hp : this.teamHealthPoint()
    }
    return game
  })

  constructor(private router: Router){
    effect(()=>{
      const list = this.allPokemon()
      if (list.length>0){
        this.loadGame()
      }
    })
  }


  selectStarter() { }

  capturePokemon(pokemon: IPokemon): string {
    
    // si pas dans pokebank capture !!! bug
    let message = ""
    if (!this.pokeBank().find(p => p.id == pokemon.id)) {
      message += `captured ${pokemon.name}`
      //this.totalCaptured.update(total => total + 1)
      this.pokeBank.update(bank => [...bank, pokemon])
      if (this.team().length < 6) {
        this.addToTeam(pokemon.id)
        message += "and is added to team"
      }
    }else{
      message += `${pokemon.name} was already captured`
    }
    this.storeCaptured()
    return message
    
  }

  addToSeen(pokemon:IPokemon){
    this.pokemonSeen.update(pokemons=>[...pokemons,pokemon])
    this.storeSeen()
  }

  addToTeam(id: number) {

    console.log("adding to team : ",id)
    if (this.team().length<6 && !this.team().find(p=>p.id==id)){
    const p = this.pokeBank().find(p => p.id == id)
    if (p){
    this.team.update(team => [...team, p!])}

    this.storeTeam()
    this.updateTeamHP()
  }}

  removeFromTeam(id: number) {
    this.team.update(team => team.filter(p => p.id != id))
    this.storeTeam()
    this.updateTeamHP()
  }

  isCaptured() { }

  resetGame() {
    //this.totalCaptured.set(0)
    this.team.set([])
    this.pokeBank.set([])
    this.pokemonSeen.set([])
    this.attempt.set(0)
    this.teamHealthPoint.set([])
    this.storeGame()


  }
    swapLastAndFirst(){
    const remain = this.team().filter((p, i) => i < this.team().length && i>0)
    //const remain = this.team().slice(1,this.team().length-1)
    const first = this.team()[0]
    const last = this.team()[this.team().length-1]
    //const sfx = this.team().filter((p, i) => i > 0)
    this.team.set([last,...remain,first])
  }

  gameData(){
    return {
      captured : this.pokeBank(),
      team : this.team(),
      seen : this.pokemonSeen(),
      attempt : this.attempt(),
      team_hp : this.teamHealthPoint()
    }
  }

  storeGame(){
    //console.log(this.gameStorage())
    //localStorage.setItem("pokeGame",JSON.stringify(this.gameStorage()))
    this.storeCaptured()
    this.storeSeen()
    this.storeTeam()
    this.storeAttempt()
    this.storeHP()
  }

  storeCaptured(){
    localStorage.setItem("captured",JSON.stringify(this.gameStorage().captured))
  }
  storeSeen(){
    localStorage.setItem("seen",JSON.stringify(this.gameStorage().seen))
  }
  storeTeam(){
    localStorage.setItem("team",JSON.stringify(this.gameStorage().team))
  }
  storeAttempt(){
    localStorage.setItem("attempt",JSON.stringify(this.gameStorage().attempt))
  }
  storeHP(){
    localStorage.setItem("team_hp",JSON.stringify(this.gameStorage().team_hp))
  }


  isGameData(data:any){

  return true

  }
  loadGame(data:IGame|null=null) {
    let bank = null
    let seen = null
    let team_hp = null
    let attempt = 0
    if (data){
      //console.log("data to load : ",data)
      // zod schema is best practice , validate data is not implemented ! (isGameData)
      // set bank team and seen here (from data) !!!!!!!!!!!!!!!!!!!!!!!!!
      if (this.isGameData(data)){
        //console.log("data.bank : ",data.captured)
        this.pokeBank.set(data.captured)
        this.team.set(data.team)
        this.pokemonSeen.set(data.seen)
        //console.log("bank : ",this.pokeBank())
        //console.log("bank length :",this.pokeBank().length)
        this.attempt.set(data.attempt)
        this.teamHealthPoint.set(data.team_hp)
        this.storeGame()
        //return true
        this.router.navigate(["/layout/encounter"])
      }else{
        alert("file is invalid")
      }

    }
    const team = this.loadTeam()
    if (team.length>0){
      //console.log(team)
      // can launch other setting
      team_hp = this.loadHP()
      bank = this.loadBank()
      seen = this.loadSeen()
      attempt = this.loadCpt()
      

      if (bank && seen && team_hp){
      // return true : meaning setting where found
      this.team.set(team)
      this.teamHealthPoint.set(team_hp)
      this.pokeBank.set(bank)
      this.pokemonSeen.set(seen)
      this.attempt.set(attempt)
      //this.teamHealthPoint.set(team_hp)

      return true}
      else{
        alert("team were found but not bank or seen")
        return false
      }
    }
    return false
  }

  loadHP(){
    const team_hp_str = localStorage.getItem("team_hp")
    let team_hp:number[] = []
    let res :number[]= []
    if (team_hp_str){
      team_hp =JSON.parse(team_hp_str)
      console.log("team_hp : ",team_hp)
      res = team_hp.map(hp=>Number(hp))
    }
    console.log("res : ",res)
    return res

  }

  loadTeam(){
    const team_str = localStorage.getItem("team")
    let team:number[] = []
    let res :IPokemon[]= []
    if (team_str){
      team =JSON.parse(team_str)
      //console.log("team : ",team)
      res = team.map(id=>this.allPokemon().find(p=>p.id==id)!)
    }
    //console.log("res : ",res)
    return res
  }
  loadSeen(){
    const seen_str = localStorage.getItem("seen")
    let seen:number[] = []
    let res:IPokemon[] = []
    if (seen_str){
      seen =JSON.parse(seen_str)
      //console.log("seen : ",seen)
      res = seen.map(id=>this.allPokemon().find(p=>p.id==id)!)
    }
    //console.log("res : ",res)
    return res


  }
  loadBank(){
    const bank_str = localStorage.getItem("captured")
    let bank:number[] = []
    let res:IPokemon[] = []
    if (bank_str){
      bank =JSON.parse(bank_str)
      //console.log("captured : ",bank)
      //console.log("all pokemon",this.allPokemon())
      //console.log("pokemon that should be found (4 as cst): ",this.allPokemon().find(p=>p.id==4))
      res = bank.map(id=>this.allPokemon().find(p=>p.id==id)!)
    }
    //console.log("res : ",res)
    return res

  }

  loadCpt(){
    //return Number(JSON.parse(localStorage.getItem("attempt")))
    const cpt_str = localStorage.getItem("attempt")
    let cpt : number = 0
    if (cpt_str){
      cpt = Number(JSON.parse(cpt_str))
    }
    return cpt
  }

  placeInTeam(index:number,pokemon:IPokemon){
    if (this.team().length<6){
      const prfx = this.team().slice(0,index)
      const sfx = this.team().slice(index)
      this.team.update(team=>[...prfx,pokemon,...sfx])
    }
  }

  replaceInTeam(index:number,pokemon:IPokemon){
    const prfx = this.team().slice(0,index)
      const sfx = this.team().slice(index+1)
      this.team.update(team=>[...prfx,pokemon,...sfx])

  }
  addToBank(pokemon:IPokemon){
    this.pokeBank.update(pokemons=>[...pokemons,pokemon])
    this.storeCaptured()
}

updateTeamHP(){
  this.teamHealthPoint.set(this.team().map(p=>p.stats.HP))
  this.storeHP()
}
}
