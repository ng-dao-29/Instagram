import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import {User} from "./User";
import {Comment} from "./Comment";
import {Like} from "./Like";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar"})
    content: string;

    @Column({type: "timestamp", default: () => "now()"})
    created_at: Date;

    @Column({type: "varchar"})
    image_url: string;

    @ManyToOne(() => User, (user) => user.posts)
    postedBy: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany(() => Like, (likes) => likes.post)
    likes: Like[];
}
