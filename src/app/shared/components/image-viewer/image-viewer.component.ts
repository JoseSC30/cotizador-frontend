import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent {
  @Input() imageUrl?: SafeUrl | string | null;
  @Output() closeModal = new EventEmitter<void>();

  closeImageModal() {
    this.closeModal.emit();
  }
}
