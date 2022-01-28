import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';
import { FindAllArticleDto } from './dto/find-all-article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { CategoryService } from '@root/category/category.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    writerId: number,
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    await this.categoryService.existOrFail(createArticleDto.categoryId);
    return this.articleRepository.save({ ...createArticleDto, writerId });
  }

  findAll(options?: FindAllArticleDto): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }

  getOne(id: number): Promise<Article> {
    return this.articleRepository.findOneOrFail(id);
  }

  getOneDetail(id: number): Promise<Article> {
    return this.articleRepository.getOneDetailOrFail(id);
  }

  async update(
    id: number,
    writerId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<void> {
    if (updateArticleDto.categoryId)
      await this.categoryService.existOrFail(updateArticleDto.categoryId);
    const article = await this.articleRepository.findOneOrFail({
      id,
      writerId,
    });
    const newArticle = {
      ...article,
      ...updateArticleDto,
    };

    this.articleRepository.save(newArticle);
  }

  async remove(id: number, writerId: number): Promise<void> {
    const result = await this.articleRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }
  }

  increaseViewCount(article: Article): void {
    article.viewCount += 1;
    this.articleRepository.save(article);
  }

  increaseCommentCount(article: Article): void {
    article.commentCount += 1;
    this.articleRepository.save(article);
  }

  decreaseCommentCountById(article: Article): void {
    article.commentCount -= 1;
    this.articleRepository.save(article);
  }

  increaseLikeCount(article: Article): void {
    article.likeCount += 1;
    this.articleRepository.save(article);
  }

  decreaseLikeCount(article: Article): void {
    if (article.likeCount < 1) {
      throw new NotAcceptableException('좋아요는 0이하가 될 수 없습니다.');
    }
    article.likeCount -= 1;
    this.articleRepository.save(article);
  }
}
