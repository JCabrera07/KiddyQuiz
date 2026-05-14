import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// Importamos MatDialog y MatDialogModule
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 

// Servicios
import { ClaseService } from 'src/app/core/services/clase.service';
import { EvaluacionService } from 'src/app/core/services/evaluacion.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Componentes
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateEvaluationDialogComponent } from '../create-evaluation-dialog/create-evaluation-dialog.component';

@Component({
  selector: 'app-evaluation-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule, // <--- AGREGADO: Necesario para que funcionen los diálogos
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss']
})
export class EvaluationListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['img', 'titulo', 'descripcion', 'fechas', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  cargando: boolean = true;
  claseId: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private claseService: ClaseService,
    private evaluacionService: EvaluacionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog // <--- AGREGADO: Inyección del servicio de diálogo
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.claseId = +idParam;
      this.listarEvaluaciones();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarEvaluaciones(): void {
    this.cargando = true;
    this.claseService.obtenerEvaluaciones(this.claseId).subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.cargando = false;
        console.log('Evaluaciones:', res);
      },
      error: (err) => {
        console.error('Error cargando evaluaciones', err);
        this.cargando = false;
        this.mostrarSnack('Error al cargar datos', true);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cambiarEstado(evaluacion: any, event: any) {
    const nuevoEstado = event.checked;
    // Aquí deberías llamar al servicio para persistir el cambio
    // this.evaluacionService.actualizarEstado(evaluacion.id, nuevoEstado).subscribe(...)
    
    evaluacion.estado = nuevoEstado;
    const estadoTexto = nuevoEstado ? 'Activada' : 'Desactivada';
    
    this.mostrarSnack(`Evaluación ${estadoTexto}`);
  }

  volver() {
    this.router.navigate(['/teacher/class']); 
  }

  // --- CREAR ---
  crearEvaluacion() {
    const dialogRef = this.dialog.open(CreateEvaluationDialogComponent, {
    width: '800px',
    maxWidth: '95vw',
      data: { claseId: this.claseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.evaluacionService.crearEvaluacion(result).subscribe({
          next: () => {
            this.mostrarSnack('Evaluación creada correctamente');
            this.listarEvaluaciones(); // CORREGIDO: Antes llamabas a cargarEvaluaciones()
          },
          error: (err) => this.mostrarSnack('Error al crear', true)
        });
      }
    });
  }

  // --- EDITAR ---
// --- EDITAR ---
  editarEvaluacion(evaluacion: any) {
    console.log('Objeto a editar recibido:', evaluacion); // <--- VERIFICA ESTO EN CONSOLA
    
    // Validación de seguridad
    if (!evaluacion || !evaluacion.id) {
      console.error('Error: El objeto evaluación no tiene ID valido', evaluacion);
      this.snackBar.open('Error interno: No se pudo identificar la evaluación', 'Cerrar');
      return;
    }

    const dialogRef = this.dialog.open(CreateEvaluationDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      panelClass: 'dialog-empresarial',
      disableClose: true,
      data: { 
        claseId: this.claseId,
        evaluacion: evaluacion 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí usamos evaluacion.id, que ahora sabemos que existe (es 4)
        this.evaluacionService.editarEvaluacion(evaluacion.id, result).subscribe({
          next: () => {
            this.snackBar.open('Evaluación actualizada', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
            this.listarEvaluaciones();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }

  // --- ELIMINAR ---
  eliminarEvaluacion(id: number) {
    // CORREGIDO: Usando ConfirmDialogComponent en lugar de window.confirm
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Eliminar Evaluación',
        mensaje: '¿Estás seguro de eliminar esta evaluación? Esta acción no se puede deshacer.',
        textoBoton: 'Sí, Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.evaluacionService.eliminarEvaluacion(id).subscribe({
          next: () => {
            this.mostrarSnack('Evaluación eliminada');
            this.listarEvaluaciones(); // CORREGIDO
          },
          error: (err) => this.mostrarSnack('Error al eliminar', true)
        });
      }
    });
  }

  // --- MÉTODO FALTANTE ---
  private mostrarSnack(mensaje: string, esError: boolean = false) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: esError ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}