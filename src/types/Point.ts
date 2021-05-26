import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, Equals, IsArray, IsNumber, IsNumberString } from "class-validator";
import { GeoJsonObject, Position } from "geojson";

export class Point {
  @Equals('Point')
  type: "Point";
  
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: number[];
}