import { IsDate, IsDefined, IsInt, IsOptional } from "class-validator";
import { IsDateGreaterThanToday } from "src/validators";

export class CreateReservationDto {
  @IsDefined()
  @IsDate()
  @IsDateGreaterThanToday()
  startDate: Date;

  @IsDefined()
  @IsDate()
  @IsDateGreaterThanToday()
  endDate: Date;

  @IsDefined()
  @IsInt()
  tourId: number;

  @IsOptional()
  userId: number;
}
