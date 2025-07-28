import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateTeamDTO {
  @ApiProperty({
    description: 'Nome do time de atendimento',
    examples: ['Market', 'Produtos'],
  })
  @IsString()
  name: string
}
