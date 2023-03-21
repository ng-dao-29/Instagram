import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Post} from "./Post";
import {User} from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar"})
    comment_text: string;

    @Column({type: "timestamp", default: () => "now()"})
    created_at: Date;

    @ManyToOne((type) => User, (user) => user.comments)
    user: User;

    @ManyToOne((type) => Post, (post) => post.comments, {
        onDelete: "CASCADE",
    })
    post: Post;
}
