import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    console.log(createBlogDto);
    const user = await this.userRepository.findOne({
      where: { username: createBlogDto.username },
    });
    const tag = await this.tagRepository.findOne({
      where: { name: createBlogDto.tag },
    });
    const created_at = new Date();
    const toCreate = await this.blogRepository.insert({
      title: createBlogDto.title,
      text: createBlogDto.text,
      created_at: created_at,
      user: user,
      tag: tag,
    });
    return toCreate;
  }

  async findAll() {
    const blog = await this.blogRepository.find({
      select: {
        id: true,
        title: true,
        text: true,
        created_at: true,
        user: {
          username: true,
        },
        tag: {
          name: true,
        },
      },
      relations: {
        user: true,
        tag: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return blog;
  }

  async findOne(id: number) {
    const blog = await this.blogRepository.findOne({
      select: {
        id: true,
        title: true,
        text: true,
        created_at: true,
        tag: {
          name: true,
        },
        user: {
          username: true,
        },
      },
      relations: {
        user: true,
        tag: true,
      },
      where: {
        id: id,
      },
    });
    if (!blog) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    if (!updateBlogDto.created_at) {
      updateBlogDto.created_at = new Date();
    }
    const blog = await this.blogRepository.findOneBy({ id: id });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    Object.assign(blog, updateBlogDto);
    return this.blogRepository.save(blog);
  }

  remove(id: number) {
    if (this.findOne(id)) {
      this.blogRepository.delete(id);
      return `This action removes a #${id} blog`;
    }
  }
}
