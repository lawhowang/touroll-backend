// import { Optional } from "@nestjs/common"

import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToClass, Transform } from "class-transformer";
import { IsBoolean, isIn, IsIn, IsInt, IsOptional, Max, Min, validate, validateSync } from "class-validator";

export class PageInfo {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 20

  @IsOptional()
  @IsInt()
  after: number = null

  @IsOptional()
  orderBy: string = 'id';

  @IsOptional()
  @Transform(v => ["1", 1, "true", true].includes(v as any))
  @IsBoolean()
  desc: boolean = false
}

export const Pagination = createParamDecorator(
  (sortableKeys: string[], ctx: ExecutionContext): PageInfo => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query
    const object = plainToClass(PageInfo, query, { enableImplicitConversion: true });
    const errors = validateSync(object);
    if (errors.length > 0) {
      throw new BadRequestException(Object.values(errors[0].constraints))
    }
    if (object.orderBy) {
      const sortingAllowedFields = sortableKeys || ['id']
      if (!isIn(object.orderBy, sortingAllowedFields)) {
        throw new BadRequestException('invalid orderBy value')
      }
    }
    return object;
  },
);
