import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lazy-image',
  templateUrl: './lazy-image.component.html',
  styleUrls: ['./lazy-image.component.css']
})
export class LazyImageComponent implements OnInit {
  @Input() url!: string;
  @Input() alt: string = '';
  public hasLoaded: boolean = false;
  
  ngOnInit(): void {
    if (!this.url) {
      throw new Error('Url is required');
    }
  }
  
  onLoad(): void {
    setTimeout(() => {
      this.hasLoaded = true;
    }, 1000);
  }
}
