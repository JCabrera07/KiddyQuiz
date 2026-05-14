import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // <--- NUEVO IMPORT

// IMPORTAR EL SERVICIO
import { AnalyticsService, DashboardResponse } from 'src/app/core/services/analytics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-teacher-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    BaseChartDirective,
    MatProgressSpinnerModule,
    MatProgressBarModule // <--- AGREGADO AQUÍ
  ],
  templateUrl: './teacher-analytics.component.html',
  styleUrls: ['./teacher-analytics.component.scss']
})
export class TeacherAnalyticsComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  cargando = true;

  // --- KPIS ---
  kpis = [
    { title: 'Estudiantes Totales', value: '0', icon: 'groups', color: 'primary', trend: '' },
    { title: 'Promedio General', value: '0.0', icon: 'insights', color: 'accent', trend: '' },
    { title: 'Pendientes', value: '0', icon: 'assignment_late', color: 'warn', trend: '' },
    { title: 'Clases Activas', value: '0', icon: 'class', color: 'success', trend: '' }
  ];

  // --- GRÁFICO BARRAS ---
  public barChartLegend = false; // Ocultamos leyenda si solo hay un dataset
  public barChartPlugins = [];
  
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Nota Promedio', backgroundColor: '#1565C0' },
    ]
  };

  // OPCIONES MEJORADAS (Barras Redondeadas)
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false }, // Quita líneas verticales
      },
      y: {
        grid: { color: '#f5f5f5' }, // Líneas horizontales muy suaves
        beginAtZero: true,
        max: 10 // Asumiendo escala de 0 a 10
      }
    },
    elements: {
      bar: {
        borderRadius: 20, // <--- REDONDEAR BARRAS
        borderSkipped: false // Redondea también la base (efecto flotante)
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#263238',
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    }
  };

  // --- GRÁFICO DONA ---
  public doughnutChartLabels: string[] = ['Aprobados', 'En Riesgo', 'Reprobados'];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { 
      data: [0, 0, 0],
      backgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
      hoverBackgroundColor: ['#43A047', '#FB8C00', '#E53935'],
      borderWidth: 0 // Sin bordes blancos
    }
  ];

  // OPCIONES MEJORADAS (Dona Fina + Sin Leyenda default)
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // <--- DONA MÁS FINA
    plugins: {
      legend: { display: false } // <--- OCULTAR LEYENDA DEFAULT (Usaremos HTML)
    }
  };

  // --- TABLA ---
  displayedColumns: string[] = ['estudiante', 'clase', 'promedio', 'estado', 'acciones'];
  dataSource: any[] = [];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    this.cargando = true;
    
    this.analyticsService.getDashboardData().subscribe({
      next: (data: DashboardResponse) => {
        
        // 1. ACTUALIZAR KPIS
        this.kpis[0].value = data.kpis.totalEstudiantes.toString();
        this.kpis[1].value = data.kpis.promedioGeneral;
        this.kpis[2].value = data.kpis.evaluacionesPendientes.toString();
        this.kpis[3].value = data.kpis.clasesActivas.toString();

        // 2. ACTUALIZAR GRÁFICO BARRAS
        this.barChartData = {
          labels: data.rendimientoPorClase.map(item => item.clase),
          datasets: [
            { 
              data: data.rendimientoPorClase.map(item => item.promedio), 
              label: 'Nota Promedio', 
              backgroundColor: '#1565C0',
              hoverBackgroundColor: '#0D47A1'
            }
          ]
        };

        // 3. ACTUALIZAR GRÁFICO DONA
        this.doughnutChartDatasets = [{
          data: [
            data.estadoEstudiantes.aprobados,
            data.estadoEstudiantes.riesgo,
            data.estadoEstudiantes.reprobados
          ],
          backgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
          hoverBackgroundColor: ['#43A047', '#FB8C00', '#E53935'],
          borderWidth: 0
        }];

        // 4. ACTUALIZAR TABLA DE RIESGO
        this.dataSource = data.estudiantesEnRiesgo;

        this.chart?.update();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando analíticas:', err);
        this.cargando = false;
      }
    });
  }
}