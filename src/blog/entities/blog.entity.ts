import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @ManyToOne(() => Tag, (tag) => tag.name)
  tag: Tag;
}
