import { Blog } from 'src/blog/entities/blog.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  created_at: Date;

  // @OneToOne(() => Blog)
  // @JoinColumn()
  // blog: Blog;
}
