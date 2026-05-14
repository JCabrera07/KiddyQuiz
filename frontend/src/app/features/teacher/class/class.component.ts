import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 

// Servicios
import { ClaseService, ClaseResponse } from 'src/app/core/services/clase.service';

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
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // 👈 IMPORTANTE
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // 👈 IMPORTANTE
import { MatDialog } from '@angular/material/dialog';
import { CreateClassDialogComponent } from '../create-class-dialog/create-class-dialog.component';
import { ClassCodeDialogComponent } from '../class-code-dialog/class-code-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
    MatSnackBarModule,
         
  ],
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['img', 'asignatura', 'grado', 'fecha', 'estado', 'acciones'];
  
  dataSource = new MatTableDataSource<ClaseResponse>([]);
  cargando: boolean = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private claseService: ClaseService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listarClasesDocente();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  listarClasesDocente(): void {
    this.cargando = true;
    this.claseService.getMisClasesDocente().subscribe({
      next: (res) => {
        // Asegúrate de que tu backend traiga una propiedad 'activo' (boolean)
        // Si no la trae, puedes mapearla aquí temporalmente:
        // const data = res.map(c => ({ ...c, activo: true })); 
        this.dataSource.data = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando clases', err);
        this.cargando = false;
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

verEvaluaciones(id: number) {
    // Ahora (recomendado):
    this.router.navigate(['/teacher/clase', id, 'evaluaciones']);
}

  // --- LÓGICA DEL SWITCH EN TIEMPO REAL ---
  cambiarEstado(clase: any, event: any) {
    const nuevoEstado = event.checked;
    const estadoTexto = nuevoEstado ? 'Activada' : 'Desactivada';

    clase.activo = nuevoEstado;
    // Aquí llamarías a tu servicio real. Ejemplo:
    // this.claseService.actualizarEstado(clase.id, nuevoEstado).subscribe(...)
    
    // Simulamos la petición para que veas el efecto visual:
    console.log(`Cambiando clase ${clase.id} a estado: ${nuevoEstado}`);
    
    this.snackBar.open(`Clase ${estadoTexto} correctamente`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: nuevoEstado ? ['success-snackbar'] : ['info-snackbar']
    });
  }

crearClase() { 
  const dialogRef = this.dialog.open(CreateClassDialogComponent, {
    width: '800px', // <--- MÁS ANCHO (Estilo empresarial)
    maxWidth: '95vw', // Para móviles
    disableClose: true,
    autoFocus: false,
    panelClass: 'custom-dialog-container' // Opcional si quieres estilos globales
  });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' será el FormData que enviamos desde el modal
      if (result) {
        this.guardarNuevaClase(result);
      }
    });
  }
private guardarNuevaClase(formData: FormData) {
    this.cargando = true; // Mostrar barra de carga
    
    this.claseService.crearClase(formData).subscribe({
      next: (res) => {
        this.cargando = false;
        
        // Notificación de éxito
        this.snackBar.open(`Clase "${res.nombre}" creada con éxito`, 'Cerrar', {
          duration: 4000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });

        // Recargar la tabla para ver la nueva clase
        this.listarClasesDocente();
        this.dialog.open(ClassCodeDialogComponent, {
        width: '450px',
        disableClose: true, // Obligamos al usuario a dar clic en el botón para cerrar
        data: {
          nombre: res.nombre,
          codigo: res.codigoVinculacion // <--- Este campo viene de tu Entity Clase
        }
      });
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error creando clase', err);
        this.snackBar.open('Error al crear la clase', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'] // Asegúrate de tener este estilo o usa info-snackbar
        });
      }
    });
  }


editarClase(clase: any) { // Cambia el parámetro de id a la clase completa (element)
  
  // 1. Abrimos el mismo Dialog, pero pasándole la DATA de la clase
  const dialogRef = this.dialog.open(CreateClassDialogComponent, {
    width: '800px',
    maxWidth: '95vw',
    disableClose: true,
    data: clase // <--- AQUÍ PASAMOS LOS DATOS PARA EDITAR
  });

  dialogRef.afterClosed().subscribe(result => {
    // Si result (formData) existe, procedemos a actualizar
    if (result) {
      this.guardarEdicionClase(clase.id, result);
    }
  });
}
// Método privado para consumir el servicio de edición
private guardarEdicionClase(id: number, formData: FormData) {
  this.cargando = true; // Loading visual

  this.claseService.editarClase(id, formData).subscribe({
    next: (res) => {
      this.cargando = false;
      this.snackBar.open('Clase actualizada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar'],
        verticalPosition: 'bottom', 
        horizontalPosition: 'end'
      });
      
      this.listarClasesDocente(); // Recargamos la tabla
    },
    error: (err) => {
      this.cargando = false;
      console.error('Error editando', err);
      this.snackBar.open('Error al actualizar la clase', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'] // O 'info-snackbar'
      });
    }
  });
}

  eliminarClase(clase: any) { // Recibe el objeto clase completo para mostrar el nombre
  
  // 1. Abrir Diálogo de Confirmación
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      titulo: 'Eliminar Clase',
      mensaje: `¿Estás seguro que deseas eliminar la clase "${clase.nombre}"? Esta acción no se puede deshacer.`,
      textoBoton: 'Sí, Eliminar'
    }
  });

  // 2. Esperar respuesta del usuario
  dialogRef.afterClosed().subscribe(confirmado => {
    if (confirmado) {
      this.procesarEliminacion(clase.id);
    }
  });
}

private procesarEliminacion(id: number) {
  this.cargando = true; // Mostrar loading
  
  this.claseService.eliminarClase(id).subscribe({
    next: () => {
      this.cargando = false;
      this.snackBar.open('Clase eliminada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar'], // Verde
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.listarClasesDocente(); // Recargar tabla
    },
    error: (err) => {
      this.cargando = false;
      console.error(err);
      
      // 3. MANEJO INTELIGENTE DEL ERROR
      // Si el backend devuelve un mensaje (ej: "tiene evaluaciones"), lo mostramos
      const mensajeError = err.error?.message || 'Ocurrió un error al intentar eliminar';
      
      // Mostramos el mensaje específico en rojo (error) o advertencia
      this.snackBar.open(mensajeError, 'Entendido', {
        duration: 8000, // Duración larga para que lean la razón
        panelClass: ['error-snackbar'], // Rojo/Alerta
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  });
}
}