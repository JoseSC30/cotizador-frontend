import { Component, OnInit } from '@angular/core';

interface Chat {
  id: number;
  photo: string;
  name: string;
  title: string;
}

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrls: ['./chats-page.component.css']
})
export class ChatsPageComponent implements OnInit {
  chats!: Chat[];
  
  constructor() {
    this.chats = [];
  }
  
  ngOnInit(): void {
    
  }

  
  newChat() {
    let id = 0;
    if (this.chats.length > 0) {
      id = this.chats[this.chats.length - 1].id
    }
    this.chats.push({
      id: id + 1,
      photo: './assets/avatars/300-1.jpg',
      name: 'John Doe',
      title: 'Cotización de construcción',
    });
  }
  
}
