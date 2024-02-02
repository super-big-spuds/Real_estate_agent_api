import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: "User's name" })
  user_name: string;

  @ApiProperty({ example: 'john@example.com', description: "User's email" })
  user_email: string;

  @ApiProperty({ example: 'password123', description: "User's password" })
  user_password: string;

  @ApiProperty({ example: true, description: "User's status" })
  status: boolean;

  @ApiProperty({ example: false, description: "User's admin" })
  isadmin: boolean;

  @ApiProperty({ example: false, description: "User's delete" })
  isDelete: boolean;
}
