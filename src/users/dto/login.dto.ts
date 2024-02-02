import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@gmail.com', description: "User's email" })
  user_email: string;

  @ApiProperty({ example: 'admin', description: "User's password" })
  user_password: string;
}
