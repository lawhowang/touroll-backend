import { IsDefined, IsInt, IsOptional, IsPositive, Length, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { Point } from "src/types/Point";

export class CreateActivityDto {
    @IsDefined()
    @Length(1, 50)
    title: string;

    @MaxLength(255)
    @IsOptional()
    description: string;

    @IsDefined()
    @IsInt()
    tourId: number;

    @IsDefined()
    @IsInt()
    @Min(0)
    time: number;

    @IsDefined()
    @IsInt()
    @Min(0)
    @Max(1440)
    duration: number;
    
    @IsOptional()
    @ValidateNested()
    location: Point;

    @IsOptional()
    @MaxLength(255)
    image?: string;
}
