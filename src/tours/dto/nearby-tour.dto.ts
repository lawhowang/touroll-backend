import { Equals, IsDefined, IsNumber } from "class-validator";

export class NearbyTourDto {
  @IsDefined()
  @IsNumber()
  lat: number;

  @IsDefined()
  @IsNumber()
  lon: number;
}
