import { PipeTransform } from '@nestjs/common';
export declare class MongoIdPipe implements PipeTransform<string, string> {
    transform(value: string): string;
}
