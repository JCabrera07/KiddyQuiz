import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArasaacService {
  // Endpoint de búsqueda (Español)
  private searchUrl = 'https://api.arasaac.org/api/pictograms/es/search';
  // Base para construir la URL de la imagen
  private staticUrl = 'https://static.arasaac.org/pictograms';

  constructor(private http: HttpClient) {}

  /**
   * Busca pictogramas por texto y devuelve una lista con ID y URL ya construida
   */
  searchPictograms(searchText: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.searchUrl}/${searchText}`).pipe(
      map(results => {
        return results.map(pic => ({
          id: pic._id,
          // Construimos la URL de la imagen (resolución 300px es buen balance)
          url: `${this.staticUrl}/${pic._id}/${pic._id}_300.png`,
          keywords: pic.keywords.map((k: any) => k.keyword).join(', ')
        }));
      })
    );
  }
}
