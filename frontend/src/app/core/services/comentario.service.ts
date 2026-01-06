import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComentarioService {
  // Estado del comentario
  private comentarioSource = new BehaviorSubject<string | null>(null);
  comentario$ = this.comentarioSource.asObservable();

  // Estado de carga
  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();

  setComentario(comentario: string) {
    this.comentarioSource.next(comentario);
  }

  setLoading(state: boolean) {
    this.loadingSource.next(state);
  }
}
