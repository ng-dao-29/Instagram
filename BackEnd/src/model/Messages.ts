import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "./User";
import {Rooms} from "./Room";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Rooms, (Rooms) => Rooms.messages)
    room: Rooms;

    @ManyToOne(() => User, (Users) => Users.name)
    author: User;

    @OneToMany(() => User, (User) => User)
    users: User[];

    @Column({type: "varchar"})
    content: string;

    @Column({
        type: "timestamp",
        default: () => "now()",
    })
    time: Date;
}
