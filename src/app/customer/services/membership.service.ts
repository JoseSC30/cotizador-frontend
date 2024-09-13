import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MembershipResponse } from '../interfaces/membership.interface';
import { FullChatResponse } from '../interfaces/fullchat.interface';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  private readonly baseUrl: string = environment.baseUrl;
  
  private _currentMembership!: BehaviorSubject<MembershipResponse | null>;
  public currentMembership$!: Observable<MembershipResponse | null>;
  
  constructor(private http: HttpClient) { 
    this._currentMembership = new BehaviorSubject<MembershipResponse | null>(null);
    this.currentMembership$ = this._currentMembership.asObservable();
  }
  
  getCurrentMembership(): MembershipResponse | null {
    return this._currentMembership.getValue();
  }
  
  setCurrentMembership(membership: MembershipResponse | null) {
    this._currentMembership.next(membership);
  }
  
  getInfoMembership(): Observable<MembershipResponse> {
    const url = `${this.baseUrl}/full-chat`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<MembershipResponse>(url, { headers })
    .pipe(
      // tap((membership) => {
      //   this.setCurrentMembership(membership);
      //   console.log('Membership: ', membership);
      // }),
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  createFullChat(name: string): Observable<FullChatResponse> {
    const url = `${this.baseUrl}/full-chat`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { name };
    
    return this.http.post<FullChatResponse>(url, body, { headers })
    .pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }

}
