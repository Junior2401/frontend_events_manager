import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrateur } from '../models/administrateur';

@Injectable({
  providedIn: 'root',
})
export class AdministrateurApiService {
  private readonly apiUrl = 'http://localhost:8081/administrateurs';

  constructor(private http: HttpClient) {}

  getAdministrateurs(): Observable<Administrateur[]> {
    return this.http.get<Administrateur[]>(this.apiUrl);
  }

  getAdministrateurById(id: number): Observable<Administrateur> {
    return this.http.get<Administrateur>(`${this.apiUrl}/${id}`);
  }

  createAdministrateur(payload: Administrateur): Observable<Administrateur> {
    return this.http.post<Administrateur>(this.apiUrl, payload);
  }

  updateAdministrateur(id: number, payload: Administrateur): Observable<Administrateur> {
    return this.http.put<Administrateur>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAdministrateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
