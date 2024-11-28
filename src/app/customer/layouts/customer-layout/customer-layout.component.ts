import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'src/app/shared/interfaces/menu-item.interface';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css'],
})
export class CustomerLayoutComponent {
  showSidebar: boolean = true; // Menú lateral visible por defecto
  showFullNavbar: boolean = false; // Navbar expandido si el menú lateral está oculto
  isMobile: boolean = false; // Detecta si es una vista móvil
  menuItems!: MenuItem[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.menuItems = [
      { icon: 'bx-home', name: 'Inicio', route: '/dashboard/home' },
      { icon: 'bx-chat', name: 'Cotizar', route: '/dashboard/chats' },
      { icon: 'bx-cog', name: 'Configuración', route: '/dashboard/settings' },
    ];

    // Detectar cambios de ruta para ocultar o mostrar el menú lateral
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isChatsRoute = event.url.includes('/dashboard/chats');
        this.showSidebar = !isChatsRoute;
        this.showFullNavbar = isChatsRoute;
      }
    });

    this.checkScreenSize(); // Llamada inicial
  }

  // Detectar cambios en el tamaño de la pantalla
  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; // Detecta si es móvil
    if (!this.isMobile) {
      this.showSidebar = true; // Siempre mostrar el menú en pantallas grandes
    }
  }

  // Alterna la visibilidad del menú lateral solo en móviles
  toggleSidebar(): void {
    if (this.isMobile) {
      this.showSidebar = !this.showSidebar;
    }
  }
}

