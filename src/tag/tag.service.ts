import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const insertedTag = await this.tagRepository.insert(createTagDto);
    return insertedTag;
  }

  async findAll() {
    const tags = await this.tagRepository.find({
      select: {
        name: true,
      },
    });
    return tags;
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOneBy({ id: id });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return await this.tagRepository.findOneBy({ id: id });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findOneBy({ id: id });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  remove(id: number) {
    if (this.findOne(id)) {
      this.tagRepository.delete(id);
      return `This action removes a #${id} tag`;
    }
  }
}
