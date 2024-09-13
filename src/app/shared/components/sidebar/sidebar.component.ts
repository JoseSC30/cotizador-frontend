import { Component, Input, OnDestroy } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserCurrent } from 'src/app/auth/interfaces/user.interface';
import { Subscription } from 'rxjs';

const PHOTO: string = './assets/avatars/user-profile-dark.png';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() items: MenuItem[] = [];
  public user!: UserCurrent | null;
  public suscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {
    this.suscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }
  
  get photo(): string {
    return this.user?.profile.photo || PHOTO;
  }
  
  OnDestroy(): void {
    this.suscription.unsubscribe();
  }
  
}
