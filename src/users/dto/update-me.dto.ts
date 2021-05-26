import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class UpdateMeDto {

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
