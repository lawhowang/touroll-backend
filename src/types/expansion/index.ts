// import { Optional } from "@nestjs/common"

import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { isIn } from "class-validator";

export const Expansion = createParamDecorator(
    (expandableKeys: string[], ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest()
    const expand = request.query.expand
    if (!expand || expand.length == 0) {
        return []
    }
    const fields = expand.split(',')
    if (Array.isArray(fields) && fields.length > 0) {
      for (const field of fields) {
        if (!isIn(field, expandableKeys)) {
            throw new BadRequestException('invalid expand')
        }
      }
      return fields
    }
    return [];
  },
);
