import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(value)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    return value;
  }
}
