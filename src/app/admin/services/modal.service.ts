import { Injectable,EventEmitter } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public data$: Observable<any> = this.dataSubject.asObservable();

  
  $modal= new EventEmitter<any>();
  
  $modalCreate= new EventEmitter<any>();
  $modalEdit= new EventEmitter<any>();
  
  
  constructor() {}
  
  sendData(data: any): void {
    this.dataSubject.next(data);
  }

  getData(): Observable<any> {
    return this.data$;
  }
}
