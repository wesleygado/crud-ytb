import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, updateUserDto);
    
    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado')
    }
    
    return result;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return result;
  }
}
