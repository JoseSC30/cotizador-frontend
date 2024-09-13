import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Profile } from 'src/app/auth/interfaces/register-response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly baseUrl: string = environment.baseUrl;
  
  constructor(private http: HttpClient) { }
  
  // Actualizar el perfil del usuario
  uploadProfile(id: number, file: File, gender: string): Observable<Profile> {
    const url = `${this.baseUrl}/profile/upload-profile-image/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = new FormData();
    
    body.append('file', file);
    body.append('gender', gender);

    return this.http.patch<Profile>(url, body, { headers })
    .pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
  // Eliminar la imagen de perfil del usuario
  deleteProfileImage(id: number): Observable<any> {
    const url = `${this.baseUrl}/profile/delete-image/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete<any>(url, { headers })
    .pipe(
      catchError((err) => {
        return throwError(() => err.error.message);
      })
    );
  }
  
}
