import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavItem } from './nav-item/nav-item';
import { navItems as MENU_DATA } from './sidebar-data';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    BrandingComponent, 
    TablerIconsModule, 
    MaterialModule,
    AppNavItemComponent,
    NgScrollbarModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  navItems: NavItem[] = [];

  constructor(private authService: AuthService) {}

  @Input() showToggle = true; // true = Móvil, false = Escritorio
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  ngOnInit(): void {
    const rawRole = this.authService.getUserRole();
    const userRole = rawRole ? rawRole.trim().toUpperCase() : '';

    console.log('🔍 Rol Normalizado:', userRole);

    this.navItems = MENU_DATA.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      const rolesPermitidos = item.roles.map(r => r.toUpperCase());
      return rolesPermitidos.includes(userRole);
    });
  }

  onItemSelected(): void {
    // Solo cerramos el menú automáticamente si estamos en modo móvil
    if (this.showToggle) {
      this.toggleMobileNav.emit();
    }
  }
}