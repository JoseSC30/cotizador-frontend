import { Component, OnInit } from '@angular/core';
import { Membership } from 'src/app/customer/interfaces/membership.interface';
import { MembershipService } from 'src/app/customer/services/membership.service';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { ChatService } from '../../services/chat.service';

interface Chat {
  id: number;
  photo: string;
  name: string;
  title: string;
}

@Component({
  selector: 'app-sidebar-chat',
  templateUrl: './sidebar-chat.component.html',
  styleUrls: ['./sidebar-chat.component.css'],
})
export class SidebarChatComponent implements OnInit {
  public membership: Membership | undefined;
  public chats!: Chat[];
  public modalOpen: boolean = false;

  private adjectives: string[] = [
    'Asesoramiento',
    'Consulta',
    'Cotización',
    'Evaluación',
    'Revisión',
  ];
  private nouns: string[] = [
    'Casa',
    'Habitación',
    'Proyecto',
    'Construcción',
    'Diseño',
  ];

  constructor(
    private membershipService: MembershipService,
    private alertsService: AlertsService,
    private chatService: ChatService
  ) {
    this.getInfoMembership();
    this.chats = [];
    this.membershipService.currentMembership$.subscribe((membership) => {
      this.membership = membership?.membership;
    });
  }

  ngOnInit(): void {
   
  }

  getInfoMembership(): void {
    this.membershipService.getInfoMembership().subscribe({
      next: (memebership) => {
        this.membershipService.setCurrentMembership(memebership);
      },
      error: (err) => {
        console.error('SidebarChatComponent::Error Get Info Membership: ', err);
      },
    });
  }

  createChat(): void {
    let name = this.generateRandomName();
    this.membershipService.createFullChat(name).subscribe({
      next: (fullChat) => {
        console.log('fullChat', fullChat);
        this.chatService.setCurrentIdChatAi(fullChat.chatAi.id);
        this.getInfoMembership();
      },
      error: (err) => {
        console.error('SidebarChatComponent::Error Create Chat: ', err);
      },
    });
  }

  newChat() {
    if (
      this.membership &&
      this.membership?.chatStock.occupied >=
        this.membership?.chatStock.chatsNumber
    ) {
      this.alertsService.showAlert(
        'Ooops!',
        'info',
        'Has alcanzado el límite de chats disponibles. Por favor, actualiza tu plan.',
        () => {
          this.getInfoMembership();
          this.openPayPalModal();
        }
      );
      return;
    }

    this.createChat();

    let id = 0;
    if (this.chats.length > 0) {
      id = this.chats[this.chats.length - 1].id;
    }
    this.chats.push({
      id: id + 1,
      photo: './assets/avatars/300-1.jpg',
      name: 'John Doe',
      title: 'Cotización de construcción',
    });
  }

  generateRandomName(): string {
    const adjective =
      this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000); // Adding a random number for uniqueness
    return `${adjective} de ${noun} ${randomNum}`;
  }

  openPayPalModal() {
    this.modalOpen = true;
  }

  closePaypalModal() {
    this.modalOpen = false;
  }
}
