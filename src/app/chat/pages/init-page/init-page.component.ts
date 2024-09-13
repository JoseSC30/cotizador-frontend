import { Component, OnInit } from '@angular/core';
import { Membership, MembershipResponse } from 'src/app/customer/interfaces/membership.interface';
import { MembershipService } from 'src/app/customer/services/membership.service';

@Component({
  selector: 'app-init-page',
  templateUrl: './init-page.component.html',
  styleUrls: ['./init-page.component.css']
})
export class InitPageComponent {
  
  // public membership: Membership | undefined;

  // constructor(private membershipService: MembershipService) {
  //   this.membershipService.currentMembership$.subscribe((membership) => {
  //     this.membership = membership?.membership;
  //   })
  // }
  
  // ngOnInit(): void {
  //   this.getInfoMembership();
  // }
  
  // getInfoMembership(): void {
  //   this.membershipService.getInfoMembership().subscribe({
  //     next: (memebership) => {
  //       this.membershipService.setCurrentMembership(memebership);
  //     },
  //     error: (err) => {
  //       console.error('Error Membership Service: ', err);
  //     }
  //   })
  // }
  
}
