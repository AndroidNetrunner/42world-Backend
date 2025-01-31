import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@root/auth/auth.decorator';
import { User } from '@root/user/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentResultDto } from './dto/create-comment-result.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiOkResponse({ description: '생성된 댓글', type: Comment })
  async create(
    @GetUser() writer: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentResultDto> {
    const comment = await this.commentService.create(
      writer.id,
      createCommentDto,
    );

    return { ...comment, writer: { nickname: writer.nickname } };
  }

  @Put(':id')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiOkResponse({ description: '수정된 댓글', type: Comment })
  updateContent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateContent(id, writerId, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiOkResponse({ description: '댓글 삭제 완료' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
  ): Promise<void> {
    return this.commentService.remove(id, writerId);
  }
}
