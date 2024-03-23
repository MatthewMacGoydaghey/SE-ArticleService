import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { User } from 'src/lib/decorators/currentUser';
import { ArticleDTO } from 'src/lib/DTO/articles/ArticleDTO';
import { UserDTO } from 'src/lib/DTO/auth/UserDTO';
import { UpdArticleDTO } from 'src/lib/DTO/articles/UpdateArticleDTO';
import { Public } from 'src/lib/DTO/auth/constants';
import { CacheInterceptor} from '@nestjs/cache-manager';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from 'src/lib/DTO/articles/article.entity';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly ArticlesService: ArticlesService
  ) {}


  @ApiOperation({summary: "Возвращает массив статей в зависиости от заданных параметров"})
  @ApiResponse({status: 200, type: [Article]})
  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
  getArticles(@Query('skip') skip: number, @Query('take') take: number, @Query('author') author: string) {
    console.log('das')
    const pagination = {
      skip: skip | 0,
      take: take | 0
    }
    const filter = {
      author: author
    }
    return this.ArticlesService.getArticles(pagination, filter)
  }

  @ApiOperation({summary: "Возвращает одну статью"})
  @ApiResponse({status: 200, type: Article})
  @Public()
  @Get(':id')
  getArticle(@Param('id', ParseIntPipe) id: number) {
    return this.ArticlesService.getArticle(id)
  }


  @ApiOperation({summary: "Создаёт статью"})
  @ApiResponse({status: 201, type: Article})
  @Post()
  createArticle(@Body() body: ArticleDTO, @User() user: UserDTO) {
    return this.ArticlesService.createArticle(body, user)
  }



  @ApiOperation({summary: "Обновляет статью"})
  @ApiResponse({status: 201, type: Article})
  @Put(':id')
  updateArticle(@Param('id', ParseIntPipe) id: number, @Body() updatedArticle: UpdArticleDTO, @User() user: UserDTO) {
    return this.ArticlesService.updateArticle(id, updatedArticle, user)
  }


  @ApiOperation({summary: "Удаляет статью"})
  @ApiResponse({status: 200})
  @Delete(':id')
  deleteArticle(@Param('id', ParseIntPipe) id: number, @User() user: UserDTO) {
return this.ArticlesService.deleteArticle(id, user)
  }


}
