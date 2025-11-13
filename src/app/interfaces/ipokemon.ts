export interface IPokemon {
    id: number
    name: string
    image: string
    sprite: string
    pokedexId: number
    apiTypes: { name: string, image: string }[]
    apiEvolutions: { name: string, pokedexId: number }[]
    //stats:IStat[]
    //stats:{name:string,value:number}[]
    //stats:{[key:string]:number}
    stats: {
        HP: number
        attack: number
        defense: number
        special_attack: number
        special_defense: number
        speed: number
    }
    apiResistances: {
        name: string
        damage_multiplier: number
        damage_relation: string
    }[]


}

export interface IStat {
    name: string
    value: number
}

export interface IResistance {
    name: string
    damage_multiplier: number
    damage_relation: string

}
export interface IType {
    name:string
    image:string
}


export interface IGame {

    captured : IPokemon[]
    team : IPokemon[]
    seen : IPokemon[]
    attempt : number
    team_hp : number[]
}

