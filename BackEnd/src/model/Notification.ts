import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import {User} from "./User";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.userSends)
    userSend: User;

    @ManyToOne(() => User, (user) => user.userGets)
    userGet: User;

    @Column()
    message: string;

    @Column({default: false})
    read: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
