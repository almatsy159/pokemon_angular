import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Starter } from './pages/starter/starter';
import { Layout } from './pages/layout/layout';
import { Pokedex } from './pages/pokedex/pokedex';
import { Encounter } from './pages/encounter/encounter';
import { starterSelectedGuard } from './guards/starter-selected-guard';
import { PokemonDetail } from './pages/pokemon-detail/pokemon-detail';

export const routes: Routes = [
    {path:"starter",component:Starter,canActivate:[starterSelectedGuard]},
    {path:"layout",component:Layout,canActivate:[starterSelectedGuard],children:[
        {path:"pokedex/:id",component:PokemonDetail},
        {path:"pokedex",component:Pokedex},
        {path:"encounter",component:Encounter},
        {path:"",redirectTo:"encounter",pathMatch:"full"}
    ]},
    {path:"",component:Starter}
];
