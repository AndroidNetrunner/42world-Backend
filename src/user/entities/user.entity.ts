import { Authenticate } from '@authenticate/entities/authenticate.entity';
import { Article } from '@article/entities/article.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Notification } from '@notification/entities/notification.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Best } from '@root/best/entities/best.entity';
import { Reaction } from '@root/reaction/entities/reaction.entity';

export enum UserRole {
  CADET = 'CADET',
  ADMIN = 'ADMIN',
}

@Entity('user')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  nickname!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  oauth_token!: string;

  @ApiProperty()
  @Column({ nullable: false, default: false })
  is_authenticated!: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  last_login?: Date;

  @ApiProperty({ example: UserRole.CADET })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CADET })
  role!: string;

  @ApiProperty()
  @Column({ nullable: false, default: 0 })
  character!: number;

  @ApiProperty()
  @Column({ nullable: true })
  deleted_at?: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Article, (article) => article.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article[];

  @OneToMany(() => Comment, (comment) => comment.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  notification?: Notification[];

  @OneToOne(() => Authenticate, (authenticate) => authenticate.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  authenticate?: Authenticate;

  @OneToMany(() => Reaction, (reaction) => reaction.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reaction?: Reaction[];

  @OneToMany(() => Best, (best) => best.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  best?: Best[];
}
