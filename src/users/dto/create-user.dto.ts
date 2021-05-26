import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(14)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  about: string;

  @IsOptional()
  @IsString()
  icon: string;
}
