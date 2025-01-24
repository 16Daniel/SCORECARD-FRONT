import { Component, HostListener } from '@angular/core';
import { BackgroundIamgeComponent } from '../../Shared/background-iamge/background-iamge.component';
import { DashBoardMenuButtons } from '../../Interfaces/dashboard-menu-buttons.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BackgroundIamgeComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  isCollapsed = false; // Define si el menú está colapsado
  menus: DashBoardMenuButtons[] = [];

  ngOnInit() {
    this.checkScreenSize(); // Comprobar el tamaño inicial de la pantalla
    this.menus = [
      { text: 'Inicio', icon: 'fas fa-home' },
      { text: 'Seguridad', icon: 'fas fa-lock' },
      { text: 'Calidad', icon: 'fas fa-star' },
      { text: 'Eficiencia operativa', icon: 'fas fa-handshake' },
      { text: 'Financiero', icon: 'fas fa-coins' },
      { text: 'Scord card', icon: 'fas fa-chart-pie' },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize(); // Comprobar tamaño en cada redimensionamiento
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // Alternar colapso manualmente
  }

  checkScreenSize() {
    this.isCollapsed = window.innerWidth < 768; // Contraer en pantallas pequeñas
  }
}
