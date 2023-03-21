import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;
    // người dùng đang theo dõi ai
    @ManyToOne((type) => User, (user) => user.following, {
        onDelete: "CASCADE",
    })
    following: User;

    // người đang theo dõi người dùng
    @ManyToOne((type) => User, (user) => user.followers, {
        onDelete: "CASCADE",
    })
    follower: User;
}
