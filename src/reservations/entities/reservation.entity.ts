import { Tour } from "src/tours/entities/tour.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (u) => u.reservations, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Tour, (t) => t.reservations, { onDelete: 'CASCADE' })
    tour: Tour;

    @Column()
    tourId: number;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;
}
