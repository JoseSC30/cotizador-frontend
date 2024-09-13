import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserCurrent } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() routeHome?: string;
  @Input() routeSetting?: string;
  
  public user!: UserCurrent | null;
  
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    })
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  
  // get currentUser(): UserCurrent | null {
  //   return this.user;
  // }
  
}
