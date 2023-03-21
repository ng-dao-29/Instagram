import {Notification} from "./Notification";
import {
    Entity,
    Column,
    ManyToMany,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import {Post} from "./Post";
import {Comment} from "./Comment";
import {Like} from "./Like";
import {Follow} from "./Follow";
import {Rooms} from "./Room";
import {Messages} from "./Messages";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", unique: true, nullable: false})
    username: string;

    @Column({type: "varchar"})
    name: string;

    @Column({type: "varchar", nullable: false})
    password: string;

    @Column({type: "varchar", unique: true, nullable: false})
    email: string;

    @Column({
        type: "varchar",
        default:
            "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg",
    })
    profile_picture: string;

    @Column({type: "varchar", nullable: true})
    resetPasswordToken: string;

    @Column({type: "varchar", nullable: true})
    socketId: string;

    @Column({type: "timestamp", nullable: true})
    resetPasswordExpiry: Date;

    @Column({type: "timestamp", default: () => "now()"})
    created_at: Date;

    @Column({type: "enum", enum: [true, false], default: false})
    online: boolean;

    @Column({type: "timestamp", nullable: true})
    last_activity: Date;

    @OneToMany(() => Post, (post) => post.postedBy)
    posts: Post[];

    @OneToMany(() => Notification, (notification) => notification.userSend)
    userSends: Notification[];

    @OneToMany(() => Notification, (notification) => notification.userSend)
    userGets: Notification[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @OneToMany(() => Follow, (follow) => follow.following)
    following: Follow[];

    @OneToMany(() => Follow, (follow) => follow.follower)
    followers: Follow[];

    @ManyToMany(() => Rooms, (rooms) => rooms.users)
    rooms: Rooms[];

    @OneToMany(() => Rooms, (rooms) => rooms.Admin)
    AdGroup: Rooms[];

    @OneToMany(() => Messages, (message) => message.content)
    messages: Messages[];
}
