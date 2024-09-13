import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, Subject, tap} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  private readonly apiURL: string = environment.baseUrl;

  private _tableAdviser$= new Subject<void>()

  constructor(private http:HttpClient) {}

  create1(userData: {name: string, lastName: string, userName:string, email:string, password: string}){
    return this.http.post(`${this.apiURL}/asesor/create`, userData);
  }

  async getPasswordRandom(){
    let password = "Sw@";
    const quantityDigitsAdd = 4;
    
    for (let i = 0; i < quantityDigitsAdd; i++) { 
      const randomNumber = Math.floor(Math.random() * 10); 
      password += randomNumber.toString();
    }
    //fixed password
    //password="sw1@123"
    return password; 
   }

  getAllAdvisors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/asesor`);
  }

  getAdvisor(id:any){
    return this.http.get(`${this.apiURL}/asesor/${id}`)
  }

  get tableAdvisors$(){
    return this._tableAdviser$;
  }
  
  updateAdvisor(id: any, formData:any):Observable<{}>{
    return this.http.patch(`${this.apiURL}/asesor/${id}`, formData)
    .pipe(
      tap(()=>{
        this.tableAdvisors$.next();
      })
    )
  }

  deleteAdvisor(id: any): Observable<{}> {
    return this.http.delete(`${this.apiURL}/asesor/${id}`)
    .pipe(
      tap(() => {
        this.tableAdvisors$.next();
      })
    ); 
   }

   create(userData: {name: string, lastName: string, email:string, password: string}):Observable<{}>{
    return this.http.post(`${this.apiURL}/asesor/create`, userData)
    .pipe(
      tap(()=>{
        this.tableAdvisors$.next();
      })
    );
  }
}
