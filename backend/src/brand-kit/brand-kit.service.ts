import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandKitService {
  constructor() {}

  getAll(): string {
    return 'Desde brand kit';
  }
}
