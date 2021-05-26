import { EntityTarget } from "typeorm";

export function extractFields<T>(entity: () => EntityTarget<T>, keys: (keyof T)[]) {
    return keys
}