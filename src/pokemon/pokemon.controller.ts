import { Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // @HttpCode(HttpStatus.OK) //para especificar el codigo cuando es exitosa
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }


  @Get() //con Query tendre todos los query params - localhost:3000/api/v2/pokemon?limite=200&otra=true
  findAll(@Query() paginationDto : PaginationDto) {
    console.log({paginationDto});

    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {

    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')  //el pipe es creado para manipular la info que viene de url
  remove(@Param('id', ParseMongoIdPipe ) id: string) {
    return this.pokemonService.remove(id);
  }
}
