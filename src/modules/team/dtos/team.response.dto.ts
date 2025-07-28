import { IsString, IsDate, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class TeamResponseDTO {
  @ApiProperty({
    description: 'Identificador único do time',
    example: 1,
  })
  @IsNumber()
  id: number

  @ApiProperty({
    description: 'Nome do time',
    example: 'Equipe Alpha',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Data de criação do time',
    example: '2025-07-28T12:34:56.789Z',
  })
  @IsDate()
  createdAt: Date

  @ApiProperty({
    description: 'Data da última atualização do time',
    example: '2025-07-28T15:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date
}
