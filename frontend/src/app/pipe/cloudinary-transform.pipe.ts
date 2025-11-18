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

    // Dividimos la URL en la parte antes y después de 'upload/'
    const parts = originalUrl.split('/upload/');
    if (parts.length !== 2) {
      return originalUrl; // Si no tiene el formato esperado, devolvemos la original
    }

    const transformations = `w_${width},h_${height},c_fill`;
    
    // Unimos todo de nuevo con la transformación en medio
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }
}