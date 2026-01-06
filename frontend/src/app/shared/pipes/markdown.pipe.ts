import { Pipe, PipeTransform } from '@angular/core';
import * as showdown from 'showdown';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private converter = new showdown.Converter();

  transform(value: string): string {
    return this.converter.makeHtml(value || '');
  }
}
