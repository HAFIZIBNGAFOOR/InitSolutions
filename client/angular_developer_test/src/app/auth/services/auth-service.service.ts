import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { API } from 'src/app/shared/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http:HttpClient, private router:Router) { }
  private authStatusListener = new BehaviorSubject<boolean>(false);

  login(loginData:FormData){
    return this.http.post(`${API}/login`,loginData)
  }
  setToken(token:string){
    this.authStatusListener.next(true);
    localStorage.setItem('token',token);
  }
  getToken(){
    return localStorage.getItem('token');
  }
  logout(){
    localStorage.removeItem('token');
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }
  getUserRole(): string|null {
    const token = this.getToken()
    if(token){
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.role;
    }else{
      return null
    }
  }
  getPayload():any{
    const token =this.getToken();
    if(token){
     let userPayload = atob(token.split('.')[1]);
     return JSON.parse(userPayload)
    }else return null
   }
   isLoggedIn():boolean{
    let payload = this.getPayload()
    if(payload) return payload.exp > Date.now()/1000;
    else  return false
  }
}
