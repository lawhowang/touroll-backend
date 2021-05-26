import { Tour } from "src/tours/entities/tour.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Point } from 'geojson';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tour, (t) => t.activities, { onDelete: 'CASCADE' })
  tour: Tour;

  @Column()
  tourId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  description: string;

  @Column({ type: 'int' })
  time: number;

  @Column({ type: 'int' })
  duration: number;

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  @Index({ spatial: true })
  location: Point
}
