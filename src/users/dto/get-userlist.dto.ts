import { ApiProperty } from '@nestjs/swagger';

export class GetUserListDto {
  @ApiProperty({ required: false, description: 'Name to filter users' })
  name?: string;
  @ApiProperty({ required: false, description: 'Email to filter users' })
  email?: string;
  @ApiProperty({ required: false, description: 'Status to filter users' })
  status?: boolean | null | string;

  @ApiProperty({ required: false, description: 'Offset for pagination' })
  offset?: number;

  @ApiProperty({ required: false, description: 'Page number for pagination' })
  page?: number;
}
