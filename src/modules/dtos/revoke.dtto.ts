import { ApiProperty } from '@nestjs/swagger';

export class RevokeResponseDTO {
    @ApiProperty()
    success: boolean;
}
