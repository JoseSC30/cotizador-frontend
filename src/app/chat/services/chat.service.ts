import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { Presupuesto } from '../interfaces/presupuesto.interface';
import { ChatAI, FullChatResponse } from 'src/app/customer/interfaces/fullchat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl: string = environment.baseUrl;
  
  private _currentIdChatAi!: BehaviorSubject<number | null>;
  public currentIdChatAi$!: Observable<number | null>;

  constructor(private http: HttpClient) {
    const idChatAi = this.currentIdChatAi;
    this._currentIdChatAi = new BehaviorSubject<number | null>(idChatAi);
    this.currentIdChatAi$ = this._currentIdChatAi.asObservable();
  }
  
  get currentIdChatAi(): number | null {
    const idChatAi = localStorage.getItem('idChatAi');
    return idChatAi ? Number(idChatAi) : null;
  }
  
  getCurrentIdChatAi() {
    return this._currentIdChatAi.getValue();
  }
  
  setCurrentIdChatAi(idChatAi: number | null) {
    localStorage.setItem('idChatAi', idChatAi?.toString() || '');
    this._currentIdChatAi.next(idChatAi);
  }

  createImage(prompt: string, iDChatAi: number): Observable<ChatAI> {
    const url = `${this.baseUrl}/chat-ai/create-image`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { prompt, iDChatAi };

    return this.http.post<ChatAI>(url, body, { headers })
    .pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

  createPresupuesto(prompt: string, iDChatAi: number): Observable<Presupuesto> {
    const url = `${this.baseUrl}/chat-ai/create-presupuesto`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { prompt, iDChatAi };

    return this.http.post<Presupuesto>(url, body, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  getChatAi(idChatAi: number): Observable<ChatAI>{
    const url = `${this.baseUrl}/chat-ai/${idChatAi}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<ChatAI>(url, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  } 
  
  getFullChat(idFullChat: number): Observable<FullChatResponse>{
    const url = `${this.baseUrl}/full-chat/${idFullChat}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<FullChatResponse>(url, { headers }).pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  } 
}
