import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; //la implementacion propia de nest para trabajasr con nest - es para injectar modelo en este servicio
import { Pokemon } from './entities/pokemon.entity'; //la tabla (el documento Pokemon)
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  // hacemos una injeccion de dependencias 
  constructor(
    @InjectModel(Pokemon.name) //nombre del modelo que queremon usar 
    private readonly pokemonModel : Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    // lo graba en minuscula
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      // lo guardamos en pokemon y ya paso la validacion
      const pokemon = await  this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll(paginationDto:PaginationDto) {
    const {limit = 10 , offset = 0 } = paginationDto;
    return this.pokemonModel.find()
      .limit(limit)  //para no todo sino de 5 en 5 
      .skip(offset) //para que se sale los primeros 5 - de esta manera paso a la segunda pagina
      .sort({
        no:1 //lo ordena de forma ascendente
      })
      .select('-__v') //para que no mueste este registro

  }

  async findOne(term: string) {
    let pokemon : Pokemon ;  //es del tipo del entiti
    if(!isNaN(+term)){ //si esto es un numero
      pokemon = await this.pokemonModel.findOne({ no : term })
    }
    // Mongo ID 
    if(!pokemon && isValidObjectId(term)) { //BUSCAR MEDIANTE EL ID
      pokemon = await this.pokemonModel.findById(term)
    } 
    // Name 
    if(!pokemon ) { //BUSCAR MEDIANTE EL NOMBRE
      pokemon = await this.pokemonModel.findOne({name : term.toLowerCase().trim()})
    }

    if(!pokemon ) throw new NotFoundException(`Pokemon with id , name or no "${term}" not found`)

    return pokemon 

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term); 
    
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    // PARA QUE SOLO SE LE  EDITE A EL ID QUE LE PASAMOS POR URL y NOS DA ERROR  SI SE CAMBIA EL NOMBRE, NRO QUE SE LLAME IGUAL A OTRO EN LA BD
    try {
      await pokemon.updateOne(updatePokemonDto) //el new : true es para regresar el nuevo objeto
      // de esta muestro sobrescribiendo las propiedades - pero solo para mostralo 
      return {...pokemon.toJSON(), ...updatePokemonDto  };
        
    } catch (error) {
        this.handleExceptions(error);
    }

  }

  async remove(id: string) {

      // const pokemon = await this.findOne(id);
      // await pokemon.deleteOne() ;
      // eliminamos usando el id 
      // const result= await this.pokemonModel.findByIdAndDelete(id);
      const {deletedCount } = await this.pokemonModel.deleteOne({ _id : id}); //cuidado deleteMany = delete * from pokemon 
      
      // SI EL ID DE MONGO  ES VALIDO PERO NO EXISTE EL ELEMENTO
      if(deletedCount === 0 ) 
        throw new BadRequestException(`Pokemon with id "${id}" not found`);
      
      return ;

  }

  // Metodo para manejar errores
  private handleExceptions(error : any) {
    // console.log(error) //tendremos el codigo del error 
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error) // recordar que el throw evita que se siga ejecutando
    throw new InternalServerErrorException(`Can't create pokemon - chech server logs`)



  }

}
