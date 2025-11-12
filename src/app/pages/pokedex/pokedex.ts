import { Component, computed, inject, signal } from '@angular/core';
import { Game } from '../../services/game';
import { PokemonApi } from '../../services/pokemon-api';
import { FormsModule } from '@angular/forms';
import { IPokemon } from '../../interfaces/ipokemon';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-pokedex',
  imports: [FormsModule, DragDropModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex {

  gameService = inject(Game)
  apiService = inject(PokemonApi)

  completionPercentage = computed<number>(() => Math.round(this.gameService.totalCaptured() / this.apiService.total_gen * 10000)/100)

  searchTerm = signal<string>("")

  filterMode = signal<string>("all")

  type = signal<string>("")

  loading = signal<boolean>(false)

  allPokemon = this.apiService.getGenXPokemon()

  highlightedSlot: number | null = null

  // types = computed<string[]>()
  //types:string[] = this.allPokemon().map(pokemon=>{pokemon.apiTypes})
  types = computed<string[]>(()=>(Array.from(new Set(this.allPokemon().flatMap(pokemon=>pokemon.apiTypes.map(t=>t.name))))))

  
  constructor(private router: Router) {}


  // both filter works this way (as filteredPokemon on this.allPokemon)
  filteredPokemon3 = computed<IPokemon[]>(()=>this.allPokemon().filter(pokemon=>{
    if (this.type()==""){return true}
    return pokemon.apiTypes.some(t=>t.name==this.type())
  }))
  

  filteredPokemon2 = computed<IPokemon[]>(() => this.filteredPokemon3().filter(pokemon => {
    // console.log("filtered3",this.filteredPokemon3())
    if (this.filterMode() == "captured" && this.isCaptured(pokemon.id)) {
      return true
    } else if (this.filterMode() == "not-captured" && !this.isCaptured(pokemon.id)) {
      return true
    } else if (this.filterMode() == "all") {
      return true
    }else if (this.filterMode()=="type" && pokemon.apiTypes.some(t=>t.name==this.type())){
      return true

    } else {
      return false
    }
  }))

  //by search term
  filteredPokemon = computed<IPokemon[]>(() => this.filteredPokemon2().filter(pokemon =>
    pokemon.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    || pokemon.apiTypes.some(type => type.name.includes(this.searchTerm().toLowerCase())) ||
    pokemon.id.toString().includes(this.searchTerm()))
  )

  number_of_type = computed<number>(()=>this.filteredPokemon3().length)
  catch_by_type = computed<number>(()=>{
    return this.filteredPokemon3().filter(p=>this.isCaptured(p.id)).length})
  onSearchChange() {
    console.log(this.searchTerm())
    //this.filteredPokemon.update()
    //console.log(this.allPokemon()[0].apiTypes.map(type=>type.name.includes(this.searchTerm())))
    //console.log(this.allPokemon()[0].apiTypes.some(type=>type.name.includes(this.searchTerm())))
    //console.log(this.allPokemon()[0].name.toLowerCase().includes(this.searchTerm()))
    //console.log(this.filterMode(),this.type())
    //console.log(this.filteredPokemon3())
    console.log(this.types())

  }

  isCaptured(id: number): boolean {
    if (this.gameService.pokeBank().find(p => p.id == id)) {
      return true
    }
    return false
  }

  isSeen(id: number): boolean {
    if (this.gameService.pokemonSeen().find(p => p.id == id)) {
      return true
    }
    return false
  }

  addToTeam(pokemon: IPokemon) {
    if (this.isCaptured(pokemon.id) && !this.gameService.team().find(p => p.id == pokemon.id)) {
      if (this.gameService.teamSize() < 6) {
        this.gameService.addToTeam(pokemon.id)
      }
      else {
        alert("team already full !")
      }
    } else if (!this.isCaptured(pokemon.id)) {
      alert("must catch the pokemon before adding it to team !")
    } else {
      alert("pokemon already in team !")
    }

  }

  onPokemonClick(pokemon: IPokemon) {
    console.log("it clicked !!!")
    //this.addToTeam(pokemon)
    if (this.gameService.pokemonSeen().find(p => p.id == pokemon.id)) {

      this.router.navigate([`/layout/pokedex/${pokemon.id}`])
    }
    else {
      alert("cannot see detail of a pokemon that isn't captured !")
    }
  }

  viewDetails(id: number) { }

  // swap(i:number,j:number){
  //   const arr:IPokemon[] = [...this.gameService.team()]
  //   [arr[i],arr[j]]=[arr[j],arr[i]]


  // }

  moveUp(event: PointerEvent, slot: number) {
    const prfx = this.gameService.team().filter((p, i) => i < slot - 1)
    const sfx = this.gameService.team().filter((p, i) => i > slot)
    this.gameService.team.set([...prfx, this.gameService.team()[slot], this.gameService.team()[slot - 1], ...sfx])
  }

  moveDown(event: PointerEvent, slot: number) {
    // const tmp = this.gameService.team()[slot]
    // const other = this.gameService.team()[slot+1]
    // this.gameService.team.update((team,i)=>{
    //   if (i==slot){
    //     return other
    //   }else if(i==slot+1){
    //     return tmp
    //   }else{
    //     return team[i]
    //   }
    // })

    const prfx = this.gameService.team().filter((p, i) => i < slot)
    const sfx = this.gameService.team().filter((p, i) => i > slot + 1)
    this.gameService.team.set([...prfx, this.gameService.team()[slot + 1], this.gameService.team()[slot], ...sfx])

  }



  removeFromTeam(event: PointerEvent, id: number) {
    if (this.gameService.teamSize() > 1) {
      this.gameService.team.update(team => team.filter(p => p.id != id))
    }
    else {
      alert("cannot remove the last pokemon")
    }
  }

  onDrop(event: CdkDragDrop<any, any, any>, slot: number) {
    const pokemon = event.item.data
    console.log("dropped on slot :", slot, " the pokemon :", pokemon)
    this.addToTeam(pokemon)
  }

  highlightSlot(slot: number) {
    this.highlightedSlot = slot;
  }

  unhighlightSlot(slot: number) {
    if (this.highlightedSlot === slot) this.highlightedSlot = null;
  }
  onTypeChange(type:string){
    console.log("filtered3 :",this.filteredPokemon3())
    console.log(this.filterMode(),this.type())
    this.type.set(type)
    // this.filterMode.set("type")
  }
}
