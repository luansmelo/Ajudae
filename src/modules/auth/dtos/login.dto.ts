import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDTO {
  @ApiProperty({
    description: 'O email do usuário',
    example: 'example@mail.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'A senha do usuário',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string
}
