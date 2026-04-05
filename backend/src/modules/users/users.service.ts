import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(data: { email: string; password_hash: string }) {
    const existing = await this.repo.findOne({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');
    const user = this.repo.create({
      email: data.email,
      password_hash: data.password_hash,
      plan: 'free',
      interviews_used: 0,
    });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async incrementInterviewsUsed(userId: string) {
    await this.repo.increment({ id: userId }, 'interviews_used', 1);
  }

  async setApiKey(userId: string, api_key: string) {
    await this.repo.update({ id: userId }, { api_key });
  }

  getAll() {
    return this.repo.find({ order: { email: 'ASC' } });
  }
}
