import {
  IsString,
  IsInt,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(42)
  @ApiProperty({ example: '제목 입니다.' })
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(4242)
  @ApiProperty({ example: '내용 입니다.' })
  readonly content!: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  readonly categoryId!: number;
}
