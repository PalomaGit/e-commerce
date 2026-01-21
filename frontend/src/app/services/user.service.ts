import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://inventory-app-27hd.onrender.com/api/user';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      })
    };
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(profile: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, profile, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/change-password`, request, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'No autorizado. Por favor, inicie sesión.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 404:
          errorMessage = 'Usuario no encontrado';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

