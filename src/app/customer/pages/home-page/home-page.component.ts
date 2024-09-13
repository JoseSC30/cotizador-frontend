import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  public modalOpen: boolean = false;

  constructor(private membershipService: MembershipService) {}
  
  ngOnInit(): void {
    this.getInfoMembership();
  }

  openPayPalModal() {
    this.modalOpen = true;
  }

  closePaypalModal() {
    this.modalOpen = false;
  }

  getInfoMembership(): void {
    this.membershipService.getInfoMembership().subscribe({
      next: (memebership) => {
        this.membershipService.setCurrentMembership(memebership);
      },
      error: (err) => {
        console.error('Error Membership Service: ', err);
      }
    })
  }
  
}
