import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

  
@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name) //nombre del modelo que queremon usar 
    private readonly pokemonModel : Model<Pokemon>,

    private readonly http:AxiosAdapter,
  ){}

  async executeSeed() {
    // eliminamos nuestra coleccion de pokemon para que nose repita
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20');

    // arreglo de objetos
    const pokemonToInsert: {name:string,no: number}[]= [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/') //cortar los segmentos por los /
      const no : number= +segments[segments.length - 2]; //para la penultima

      // const pokemon = await  this.pokemonModel.create({name, no});
      pokemonToInsert.push({name, no}); //[{name : bulbasor, no:1}]

    });
    // insertamos muchos arreglos - recomendable
    await this.pokemonModel.insertMany(pokemonToInsert)
    // insert into pokemon(name,no)
    // {name:bulbasour, no:1}
    // {name:bulbasour, no:2}
    // {name:bulbasour, no:3}

    return `Seed Executed`;
    // Nos premite hacer peticiones http - o puedes usar axios
    // console.log(fetch) //para la node version 18.  >nvm use 18



  }
}
