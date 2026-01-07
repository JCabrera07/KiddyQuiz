import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinaryTransform',
  standalone: true,
})
export class CloudinaryTransformPipe implements PipeTransform {
  transform(originalUrl: string, width: number, height: number): string {
    if (!originalUrl) {
      return '';
    }

    const parts = originalUrl.split('/upload/');
    if (parts.length !== 2) {
      return originalUrl;
    }

    // Cambié c_fill por c_fit
    const transformations = `w_${width},h_${height},c_fit`;
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }
}
