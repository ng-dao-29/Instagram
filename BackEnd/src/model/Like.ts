import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Post} from "./Post";
import {User} from "./User";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "timestamp", default: () => "now()"})
    created_at: Date;

    @ManyToOne((type) => User, (user) => user.likes)
    user: User;

    @ManyToOne((type) => Post, (post) => post.likes, {
        onDelete: "CASCADE",
    })
    post: Post;
}
