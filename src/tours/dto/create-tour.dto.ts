import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDefined, IsInt, IsOptional, Length, Max, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import { Point } from "src/types/Point";
import { IsDateGreaterThan } from "src/validators";

export class CreateTourDto {
    @IsDefined()
    @Length(1, 50)
    title: string;

    @IsDefined()
    @MaxLength(255)
    description: string;

    @IsDefined()
    @IsInt()
    @Min(0)
    @Max(999999999)
    price: number;

    @IsInt()
    @IsOptional()
    organizerId: number;

    //@IsDefined()
    @IsOptional()
    @MaxLength(255)
    coverImage?: string;

    @IsDefined()
    @IsBoolean()
    published: boolean;

    @IsDefined()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDefined()
    @IsDate()
    @IsDateGreaterThan('startDate')
    @Type(() => Date)
    endDate: Date;

    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(100)
    days: number;

    @IsDefined()
    @ValidateNested()
    @Type(() => Point)
    location: Point;
}
