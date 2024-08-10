import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
    @ApiProperty({ description: 'Code of book' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ description: 'Name of the title' })
    @IsString()
    @IsNotEmpty()
    title: string;


    @ApiProperty({ description: 'Name of the author' })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({ description: 'Amount of book stock' })
    @IsNumber()
    stock: number;
}
