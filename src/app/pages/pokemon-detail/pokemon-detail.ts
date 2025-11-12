import { AfterViewChecked, AfterViewInit, Component, computed, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../../services/game';
import { PokemonApi } from '../../services/pokemon-api';
import { IPokemon, IResistance, IType } from '../../interfaces/ipokemon';
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css',
})
export class PokemonDetail implements OnInit, AfterViewChecked, AfterViewInit {

  @ViewChild('radar') radar!: ElementRef
  radarChart!: Chart

  gameService = inject(Game)
  apiService = inject(PokemonApi)

  max_stat = 255

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  pokemons = this.apiService.getGenXPokemon()
  id = signal<number | null>(null)
  //pokemon = computed<IPokemon | undefined>(() => this.pokemons().find(p => p.pokedexId == Number(this.route.snapshot.paramMap.get("id"))))
  pokemon = computed<IPokemon | undefined>(() => this.pokemons().find(p => {
    if (!this.id()) {
      if (p.pokedexId == Number(this.route.snapshot.paramMap.get("id"))) { return true }
      return false
    }
    else {
      if (p.pokedexId == this.id()) { return true } else { return false }

    }
  }))



  generated = false
  //   chartData = computed(() => {
  //   if (!this.pokemon()) return null;
  //   const s = this.pokemon()!.stats;
  //   return {
  //     labels: ['attaque','defense','hp','defense speciale','attaque speciale','vitesse'],
  //     datasets: [{ label: 'Stats', data: [s.attack, s.defense, s.HP, s.sprecial_defense, s.special_attack, s.speed] }]
  //   };
  // });
  types = computed(() => {
    const map = new Map()

    this.pokemons().forEach(pokemon => {
      pokemon.apiTypes.forEach(t => {
        map.set(t.name, t.image)   // overrides duplicates
      })
    })

    return Array.from(map, ([name, url]) => [name, url])
  })


  vulnerabilities = computed(() => {
    if (this.pokemon()) {
      return this.pokemon()!.apiResistances.filter(r => r.damage_multiplier < 1)
    }
    return []
  })

  vul_images = computed(() => { return this.vulnerabilities().map(r => this.types().find(t => t[0] == r.name)) })
  resistances = computed(() => {
    if (this.pokemon()) {
      return this.pokemon()!.apiResistances.filter(r => r.damage_multiplier > 1)
    }
    return []
  })
  res_images = computed(() => { return this.resistances().map(r => this.types().find(t => t[0] == r.name)) })


  ngOnInit() {

  }
  ngAfterViewChecked(): void {
    if (this.pokemon() && this.generated == false) {
      console.log(Object.entries(this.pokemon()!.stats))
      console.log(this.pokemon()!.stats)
      this.generateGraph()
      this.generated = true
    }
  }
  ngAfterViewInit(): void {

  }

  generateGraph() {
    if (this.pokemon()) {
      const s = this.pokemon()!.stats
      this.radarChart = new Chart(this.radar.nativeElement, {
        type: 'radar',
        data: {
          labels: ['attack', 'defense', 'HP', 'defense speciale', 'attaque speciale', 'speed'],
          datasets: [{
            data: [s.attack, s.defense, s.HP, s.special_defense, s.special_attack, s.speed],
            backgroundColor: 'rgba(100, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          }]
        }, options: {
          plugins:{
            legend:{display:false}
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              // beginAtZero: true,
              // min: 0,
              // max: 255, // Ajustez selon vos valeurs max
              ticks: {
                stepSize: 50
              }
            }
          }
        }
      })
    } else {
      console.log("no pokemon found cannot draw graph")
    }

  }
  isCaptured(id: number): boolean {
    if (this.gameService.pokeBank().find(p => p.id == id)) {
      return true
    }
    return false
  }

  inTeam(id: number): boolean {
    if (this.gameService.team().find(p => p.id == id)) {
      return true
    }
    return false
  }
  toTest() {
    console.log("types : ", this.types())
    console.log("vul : ", this.vulnerabilities())
    console.log("res : ", this.resistances())
    console.log("vul images : ", this.vul_images())
    console.log(this.radar)
    //this.generateGraph()
  }
  nextPage() {

    // const index = this.gameService.pokemonSeen().find((p,i)=>{
    //   this.pokemon()!.id==p.id 
    //   return i})
    const index = this.gameService.pokemonSeen().findIndex(p => p.id == this.pokemon()!.id)
    const seen = this.gameService.pokemonSeen().sort((a, b) => a.id - b.id)
    let nextPokemon = null
    console.log(index)
    if (index + 1 < this.gameService.pokemonSeen().length) {
      nextPokemon = seen[index + 1]
      console.log("next pokemon :", nextPokemon)
      //this.router.navigate([`/layout/pokedex`,nextPokemon.pokedexId])
      this.id.set(nextPokemon.pokedexId)
    } else {
      alert("already on the last pokemon")
    }
  }
  previousPage() {
    const index = this.gameService.pokemonSeen().findIndex(p => p.id == this.pokemon()!.id)
    const seen = this.gameService.pokemonSeen().sort((a, b) => a.id - b.id)
    let nextPokemon = null
    console.log(index)
    if (index - 1 >= 0) {
      nextPokemon = seen[index - 1]
      console.log("previous pokemon :", nextPokemon)
      //this.router.navigate([`/layout/pokedex`,nextPokemon.pokedexId])
      this.id.set(nextPokemon.pokedexId)
    } else {
      alert("already on the first pokemon")
    }

  }

}
