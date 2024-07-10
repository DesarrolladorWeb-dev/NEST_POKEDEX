import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports : [ 
    //con esto ya tendremos la tabla Pokemon en mongoose                 
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema : PokemonSchema, 
      },//si tienes mas modelos aqui {}
    ])
  ],
  exports: [
    MongooseModule //solo importamos esto eso es toda la conexion
  ]
})
export class PokemonModule {}
