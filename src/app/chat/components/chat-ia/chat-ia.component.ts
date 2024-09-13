import { Component, Input, OnInit } from '@angular/core';
import { ChatAI } from 'src/app/customer/interfaces/fullchat.interface';
import { PresupuestoData } from '../../interfaces/presupuesto-data';

@Component({
  selector: 'app-chat-ia',
  templateUrl: './chat-ia.component.html',
  styleUrls: ['./chat-ia.component.css']
})
export class ChatIaComponent implements OnInit {
  // @Input() data?: ChatAI;
  // @Input() presupuesto?: any;
  
  private _data?: ChatAI;
  public presupuesto: PresupuestoData | null = null;
  
  @Input()
  set data(data: ChatAI | undefined) {
    this._data = data;
    this.parseData();
  }
  get data(): ChatAI {
    return this._data!;
  }
  
  parseData(): void {
    if (this._data) {
      try {
        this.presupuesto = this._data.data ? JSON.parse(this._data.data) : null;
      } catch (error) {
        console.error('Error parsing JSON string:', error);
      }
    }
  }
  
  constructor() {}
  
  ngOnInit(): void {
    console.log('data', this.data);
  }
  
  imageUrl: string | null = null; 
  
  // get presupuesto() {
  //   return JSON.parse(this.data!.data!) || [];
  // }
  
  openImageModal(imageUrl: string) {
    this.imageUrl = imageUrl; // Establece la URL de la imagen para mostrar en el modal
  }

  closeImageModal() {
    this.imageUrl = null; // Establecer la URL de la imagen en null para cerrar el modal
  }
  
}
