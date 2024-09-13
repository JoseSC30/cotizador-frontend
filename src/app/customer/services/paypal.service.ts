import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  private readonly baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }
  
  createOrder(amount: number) {
    const url = `${this.baseUrl}/buy-membership/paid/create-paypal-order`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { amount };
    
    return this.http.post(url, body, { headers });
  }
  
}
