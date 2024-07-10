import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1) //positivo min 1
    limit?: number;//opcional
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?:number; //opcional

}