import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, lastValueFrom, map, Observable, of, Subject, Subscription, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../interfaces/login-response.interface';
import { UserCurrent, UserRegister } from '../interfaces/user.interface';
import { RegisterResponse } from '../interfaces/register-response.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CheckTokenResponse } from '../interfaces/check-token-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit, OnDestroy {
  private readonly baseUrl: string = environment.baseUrl;
  
  private _currentUser!: BehaviorSubject<UserCurrent | null>;
  public currentUser$!: Observable<UserCurrent | null>;
  
  private _currentRole!: BehaviorSubject<string|null>;
  public currentRole$!: Observable<string|null>;
  
  private suscription: Subscription = EMPTY.subscribe();
  
  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (user && role) {
      this._currentUser = new BehaviorSubject<UserCurrent | null>(JSON.parse(user));
      this._currentRole = new BehaviorSubject<string | null>(role);
    } else {
      this._currentUser = new BehaviorSubject<UserCurrent | null>(null);
      this._currentRole = new BehaviorSubject<string | null>(null);
    }
    this.currentUser$ = this._currentUser.asObservable();
    this.suscription = this.checkAuthStatus().subscribe();
  }
  
  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  
  setCurrentUser(user: UserCurrent | null) {
    this._currentUser.next(user);
  }
  
  getCurrentUser() {
    return this._currentUser.value;
  }
  
  setCurrentRole(role: string | null) {
    this._currentRole.next(role);
  }
  
  getCurrentRole() {
    return this._currentRole.value;
  }
  
  // Inicio de sesión
  login(email: string, password: string): Observable<UserCurrent> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      switchMap(({token}) => {
        this.setAuthentication(token);
        return this.getUser();
      }),
      catchError((err) => {
        let errorMessage = err.error.message;
        console.log(errorMessage);
        if (err.status === 0) {
          errorMessage = 'No se pudo establecer conexión con el servidor. Por favor, inténtelo de nuevo.';
        } else if (errorMessage.includes('email')) {
          errorMessage = 'El email no está registrado. Por favor, regístrese.';
        } else if (errorMessage.includes('password')) {
          errorMessage = 'Contraseña incorrecta. Por favor, inténtelo de nuevo.';
        } else {
          errorMessage = 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde.';
        }
        return throwError(() => errorMessage);
      })
    );
  }

  // Registra un nuevo usuario
  register(user: UserRegister): Observable<RegisterResponse> {
    const url = `${this.baseUrl}/auth/register`;

    return this.http.post<RegisterResponse>(url, user).pipe(
      catchError((err) => {
        let errorMessage = err.error.message;
        if (err.status === 0) {
          errorMessage = 'No se pudo establecer conexión con el servidor. Por favor, inténtelo de nuevo.';
        } else if (errorMessage.includes('already exists')) {
          errorMessage = 'El email ya está registrado. Por favor, ingrese otro email.';
        } else {
          errorMessage = 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde.';
        }
        return throwError(() => errorMessage);
      })
    );
  }

  // Obtener el usuario actual
  getUser(): Observable<UserCurrent> {
    const url = `${this.baseUrl}/auth/user`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserCurrent>(url, { headers }).pipe(
      tap((user) => this.setCurrentUser(user)),
      tap((user) => localStorage.setItem('user', JSON.stringify(user))),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  private setAuthentication(token: string) {
    localStorage.setItem('token', token);
    // this.getUser().subscribe();
  }
  
  public isAuthenticated() : boolean {
    let token: any = localStorage.getItem('token');
    
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      
      if (!token) {
        this.logout();
        return false;
      }
      
      if (!decodedToken || decodedToken === undefined || helper.isTokenExpired(token)) {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      return false;
    }
    
    return true;
  }
  
  // Verifica el estado de autenticación del usuario
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-status`;
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.logout();
      return of(false);
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map((resp) => {
        this.setAuthentication(resp.token);
        return true;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }
  
  
  logout() {
    localStorage.clear()
    this.setCurrentUser(null);
  }
  
}

