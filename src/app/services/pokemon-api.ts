import { HttpClient, provideHttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { IPokemon } from '../interfaces/ipokemon';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PokemonApi {

  gen_start = 1

  total_gen = 151
  starter_id = [this.gen_start + 0, this.gen_start + 3, 133]
  http = inject(HttpClient)
  url_gen = "https://pokebuildapi.fr/api/v1/pokemon/generation"
  url_id = "https://pokebuildapi.fr/api/v1/pokemon"
  pokemon = signal<IPokemon | null>(null)

  getGenXPokemon(x: number = 1): Signal<IPokemon[]> {
    //console.log("in get generation ", x)

    return toSignal(this.http.get<IPokemon[]>(`${this.url_gen}/${x}`), { initialValue: [] })
  }
  getPokemonById(id: number): Signal<IPokemon | null> {

    const url = `${this.url_id}/${id}`
    const pokemon = toSignal(this.http.get(`${this.url_id}/${id}`),{initialValue:null})
    //console.log(`pokemon with id : ${id} = `, pokemon() ,"at : ",url)

    return toSignal(this.http.get<IPokemon>(`${this.url_id}/${id}`),{initialValue:null})

  }

  getStarters(gen: number = 1): Signal<IPokemon[]> {

    //console.log("in get starter")
    return toSignal(
      forkJoin(
        this.starter_id.map(id => this.http.get<IPokemon>(`${this.url_id}/${id}`))
      ), { initialValue: [] })
}

  getRandomGenXPokemon(gen: number = 1) {

    const id = Math.floor(Math.random() * 151) + 1;
    //console.log("getting pokemon id : ",id)
    return this.http.get<IPokemon>(`${this.url_id}/${id}`)
  }
}
