import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserResponseDto {
    @ApiProperty({
        description: 'ID do usuário',
        example: 1,
    })
    @IsString()
    id?: number;

    @ApiProperty({
        description: 'Nome do usuário',
        example: 'João Silva',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'E-mail do usuário',
        example: 'example@mail.com'
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Data de criação do usuário',
        example: '2023-10-01T12:00:00Z',
    })
    @IsString()
    createdAt?: Date;

    @ApiProperty({
        description: 'Data de atualização do usuário',
        example: '2023-10-01T12:00:00Z',
    })
    @IsString()
    updatedAt?: Date;
}