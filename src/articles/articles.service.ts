import { Cache } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ArticleDTO } from 'src/lib/DTO/articles/ArticleDTO';
import { Filter, Pagination } from 'src/lib/DTO/articles/PagInterface';
import { UpdArticleDTO } from 'src/lib/DTO/articles/UpdateArticleDTO';
import { Article } from 'src/lib/DTO/articles/article.entity';
import { UserDTO } from 'src/lib/DTO/auth/UserDTO';
import { User } from 'src/lib/DTO/auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private readonly ArticleRepository: Repository<Article>,
    private readonly AuthService: AuthService,
    @Inject('CACHE_MANAGER') private CacheManager: Cache
  ) {}


  async getArticles(pagination: Pagination, filter: Filter) {
    const {skip, take} = pagination
    let { author } = filter
    let foundUser = await this.AuthService.findUserByName(author) as User
    const articles = await this.ArticleRepository.find({take, skip, relations: {author: true}, order: {id: "ASC"},
    where: foundUser ? {author: foundUser}: undefined})
    return articles
  }


  async getArticle(id: number) {
    const foundArticle = await this.ArticleRepository.findOneBy({id: id})
    if (!foundArticle) {
      throw new NotFoundException({message: 'Article not found'})
    }
    return foundArticle
  }


  async createArticle(body: ArticleDTO, user: UserDTO) {
    const foundUser = await this.AuthService.findUser(user.id)
    const newArticle = new Article
    newArticle.title = body.title
    newArticle.description = body.description
    newArticle.author = foundUser
    await this.invaldiateCache()
    return this.ArticleRepository.save(newArticle)
  }


  async updateArticle(id: number, updatedBody: UpdArticleDTO, user: UserDTO) {
    const verified = await this.verifyAccess(id, user.id)
    verified.article.title = updatedBody.title
    verified.article.description = updatedBody.description
    await this.invaldiateCache()
    return this.ArticleRepository.save(verified.article)
  }



  async deleteArticle(id: number, user: UserDTO) {
    await this.verifyAccess(id, user.id)
    const result = await this.ArticleRepository.delete({id: id})
    if (result.affected === 0) {
      throw new BadRequestException({message: `Article with id ${id} does not exist`})
    }
    return `Article with id ${id} sucessfully deleted`
  }


  // Проверяет принадлежность запрашиваемой для изменения статьи к текущему юзеру
  async verifyAccess(articleID: number, userID: number) {
    const foundUser = await this.AuthService.findUser(userID)
    const foundArticle = await this.ArticleRepository.findOne({where: {id: articleID},
      relations: {
      author: true
    }})
    if (!foundArticle) {
      throw new NotFoundException({message: 'Article not found'})
    }
    if (!(foundArticle.author.id === foundUser.id)) {
      throw new ForbiddenException({message: "You can interact only with your own articles"})
      }
      const verified = {
        author: foundUser,
        article: foundArticle
    }
    return verified
  }



  async invaldiateCache() {
    const keys = await this.CacheManager.store.keys()
    keys.forEach((key) => this.CacheManager.del(key))
  }

}
