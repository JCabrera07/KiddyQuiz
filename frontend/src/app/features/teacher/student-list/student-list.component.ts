import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService, UsuarioBackend } from 'src/app/core/services/user.service'; // Ajusta la ruta

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule,
    MatChipsModule, MatTooltipModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  
  // Definimos las columnas exactas que pediste
  displayedColumns: string[] = ['foto', 'nombreCompleto', 'edad', 'sexo', 'grado', 'acciones'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.userService.getMyStudents().subscribe({
      next: (data: UsuarioBackend[]) => {
        
        // Transformamos la data compleja del backend a una estructura plana para la tabla
        const listaPlana = data.map(u => {
          const p = u.persona[0]; // Tomamos la primera persona del array
          return {
            id: u.id,
            foto: null, // Aún no tienes foto, dejaremos null
            nombreCompleto: p ? `${p.nombres} ${p.apellidos}` : u.username,
            edad: p?.edad || 'N/A',
            sexo: p?.sexo || 'N/A',
            grado: p?.grado || 'Sin Grado',
            rol: p?.rol || 'Sin Rol'
          };
        })
        // Opcional: Filtramos para ver solo estudiantes
        .filter(user => user.rol === 'Estudiante'); 

        this.dataSource = new MatTableDataSource(listaPlana);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarEstudiante(usuario: any) {
    console.log('Editar usuario:', usuario);
    // Aquí abrirías tu Modal de Edición (UsuarioDialog)
  }

  eliminarEstudiante(id: number) {
    console.log('Eliminar ID:', id);
    // Aquí tu lógica de eliminar
  }
}