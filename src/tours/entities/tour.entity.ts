import { Point } from "geojson";
import { Activity } from "src/activities/entities/activity.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.tours, { onDelete: 'CASCADE' })
  organizer: User;

  @Column()
  organizerId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 1 })
  days: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  @Index({ spatial: true })
  location: Point

  @OneToMany(() => Activity, (activity) => activity.tour, { cascade: true })
  activities: Activity[];

  @OneToMany(() => Reservation, (r) => r.tour, { cascade: true })
  reservations: Reservation[];

  @Column({ default: false })
  published: boolean;

  @Column({ default: 0 })
  views: number;
}
