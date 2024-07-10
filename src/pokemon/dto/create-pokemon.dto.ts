import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    // la data que voy a recibir y voy a validar - antes de insertar en la bd

    // IsInit , Is Positive , min 1 
    @IsInt()
    @IsPositive() //numero positivo
    @Min(1)
    no: number; 
    // IsString , MinLength 1
    @IsString()
    @MinLength(1)
    name:string;
}
