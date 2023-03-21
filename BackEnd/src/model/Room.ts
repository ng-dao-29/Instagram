import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
    PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "./User";
import {Messages} from "./Messages";

@Entity()
export class Rooms {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: ["group", "private"], default: "private"})
    status: string;

    @Column({type: "enum", enum: [true, false], nullable: true})
    online: boolean;

    @Column({type: "timestamp", nullable: true})
    last_activity: Date;

    @Column({type: "varchar"})
    roomName: string;

    @Column({type: "varchar"})
    avatar: any;

    @ManyToMany(() => User, (user) => user.rooms)
    @JoinTable({
        name: "users-join-room",
    })
    users: User[];

    @OneToMany(() => Messages, (Messages) => Messages.room)
    messages: Messages[];

    @ManyToOne(() => User, (User) => User.AdGroup)
    Admin: User;
}
