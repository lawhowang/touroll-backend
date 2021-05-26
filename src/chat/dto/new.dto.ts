import { IsDefined, IsString } from "class-validator";

export class NewDto {
  @IsDefined()
  @IsString()
  userId: string; //firebase uid
}