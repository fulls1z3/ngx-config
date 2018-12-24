import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from './config.service';

@Injectable()
@Pipe({
  name: 'config'
})
export class ConfigPipe implements PipeTransform {
  constructor(private readonly config: ConfigService) {}

  transform(value: string | Array<string>): any {
    return this.config.getSettings(value);
  }
}
