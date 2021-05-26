import { Reservation } from "src/reservations/entities/reservation.entity";
import { Tour } from "src/tours/entities/tour.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  @Index()
  firebaseUid?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  about?: string;

  @Column({ nullable: true })
  icon?: string;

  @OneToMany(() => Tour, (t) => t.organizer, { cascade: true })
  tours: Tour[];

  @OneToMany(() => Reservation, (r) => r.user, { cascade: true})
  reservations: Reservation;
}
