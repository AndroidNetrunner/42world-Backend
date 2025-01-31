import { Article } from '@article/entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReactionComment } from '@root/reaction/entities/reaction-comment.entity';
import { User } from '@user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  content!: string;

  @ApiProperty()
  @Column({ default: 0 })
  likeCount!: number;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_article_id')
  articleId!: number;

  @ManyToOne(() => Article, (article) => article.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article?: Article;

  @ApiProperty()
  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.comment, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @ApiProperty({ type: () => ReactionComment })
  @OneToMany(
    () => ReactionComment,
    (reactionComment) => reactionComment.comment,
    {
      createForeignKeyConstraints: false,
      nullable: true,
    },
  )
  reactionComment?: ReactionComment[];
}
