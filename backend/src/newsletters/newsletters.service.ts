import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsLettersService {
  constructor() {}

  getAll(): string {
    return 'Desde newsletters';
  }

  create() {
    return 'Desde newsletters';
  }

  getById(id: string) {
    return 'Desde newsletters con ID' + id;
  }

  update(id: string) {
    return 'Desde update newsletters con ID' + id;
  }

  delete(id: string) {
    return 'Desde delete newsletters con ID' + id;
  }

  updateStatus(id: string) {
    return 'Desde update status newsletters con ID' + id;
  }

  getLogs(id: string) {
    return 'Desde logs newsletters con ID' + id;
  }

  getComments(id: string) {
    return 'Desde comments newsletters con ID' + id;
  }

  addComment(id: string) {
    return 'Desde add comment newsletters con ID' + id;
  }
}
