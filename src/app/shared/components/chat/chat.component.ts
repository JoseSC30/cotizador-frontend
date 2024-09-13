import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('imageInput') imageInputRef!: ElementRef;
  @ViewChild('chatMessages', { static: true }) chatMessagesRef!: ElementRef;

  messages: any[] = [];
  newMessage: string = '';
  selectedImage: File | null = null;
  initialHeightTextarea!: string;
  imageUrl: SafeUrl | null = null; 
  
  constructor(private sanitizer: DomSanitizer) {}
  
  ngAfterViewInit() {
    this.initialHeightTextarea = this.textareaRef.nativeElement.style.height; // Guarda la altura inicial
  }

  sendTextMessage(): void {
    if (this.newMessage.trim() !== '') {
      this.messages.push({
        type: 'text',
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });
      this.newMessage = '';
      this.resetInput();
    }
  }

  sendImageMessage(): void {
    if (this.selectedImage) {
      this.messages.push({
        type: 'image',
        image: this.selectedImage,
        sender: 'user',
        timestamp: new Date()
      });
      this.selectedImage = null;
      this.resetInput();
    }
  }
  
  openImagePicker(): void {
    this.imageInputRef.nativeElement.click();
  }

  sanitizeImageUrl(image: File): SafeUrl {
    const objectUrl = URL.createObjectURL(image);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }
  
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedImage = inputElement.files?.[0] || null;
  }
  
  resetInput(): void {
    setTimeout(() => {
      this.scrollToBottom();
    });
    this.textareaRef.nativeElement.style.height = this.initialHeightTextarea;
  }

  scrollToBottom(): void {
    this.chatMessagesRef.nativeElement.scrollTop = this.chatMessagesRef.nativeElement.scrollHeight;
  }
  
  autoResize(): void {
    this.textareaRef.nativeElement.style.height = 'auto'; // Restaura la altura a su valor automático
    this.textareaRef.nativeElement.style.height = this.textareaRef.nativeElement.scrollHeight + 'px'; // Establece la altura según el contenido
  }
  
  openImageModal(imageUrl: SafeUrl) {
    this.imageUrl = imageUrl; // Establece la URL de la imagen para mostrar en el modal
  }

  closeImageModal() {
    this.imageUrl = null; // Establecer la URL de la imagen en null para cerrar el modal
  }
}
