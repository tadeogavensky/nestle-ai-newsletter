import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  constructor() {}

  generateTextContent() {
    return 'Generando contenido de texto con IA...';
  }
}
