import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose"; //ayudara a que tenga metodos y sea mas facil


@Schema()
export class Pokemon  extends Document{
    //como nosotros queremos grabar en la base de datos
    // id :  string  // mongo me lo da
    @Prop({
        unique: true,
        index: true, // el indice para saber donde esta el name
    })
    name: string;

    @Prop({
        unique: true,
        index: true, 
    })
    no : number; 
}

// este esquema es lo que dira cuando me este registrando en la base de daots
// como las definiciones que quieres que use , estas son las reglas etx
export const PokemonSchema = SchemaFactory.createForClass(Pokemon)



