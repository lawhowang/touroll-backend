import { Tour } from "src/tours/entities/tour.entity";
import { PageInfo } from "src/types/pagination";
import { Condition, EntityTarget, FindConditions, FindManyOptions, LessThan, MoreThan, ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

function paginate<T>(repository: Repository<T>, { orderBy, after, limit, desc }: PageInfo, where?: FindConditions<T> | ((qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>), relations?: string[]) {
  const target = repository.metadata.name
  let q = repository.createQueryBuilder('t')
  if (where) {
    if (where instanceof Function) {
      q = where(q);
    } else {
      q = q.where(where)
    }
  }
  if (relations) {
    for (const relation of relations) {
      q = q.leftJoinAndSelect(`t.${relation}`, relation)
    }
  }
  q = q.addOrderBy(`t.${orderBy}`, desc ? 'DESC' : 'ASC')
  if (orderBy != 'id') {
    q = q.addOrderBy('t.id', 'ASC')
    if (after != null && after != 0) {
      q = q.leftJoin((q) => q.createQueryBuilder().subQuery().select(['id', `"${orderBy}"`]).from(target, 't'), 's', 's.id = :id', { id: after })
      q = q.andWhere(`(t.${orderBy} ${desc ? '<' : '>'} s."${orderBy}" OR (t.${orderBy} = s."${orderBy}" AND t.id > s.id))`)
    }
  } else {
    if (after != null && after != 0)
      q = q.andWhere(`id ${desc ? '<' : '>'} :after`, { after })
  }
  q = q.limit(limit)
  return q.getMany()
}
export {
  paginate
}