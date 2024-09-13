import { Component } from '@angular/core';
import { MenuItem } from 'src/app/shared/interfaces/menu-item.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  showSidebar: boolean = true;
  showFullNavbar: boolean = false;
  menuItems!: MenuItem[];
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.menuItems = [
      { icon: 'bx-home', name: 'Home', route: '/home' },
    ];
  }
}
