import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organisateur } from '../models/organisateur';

@Injectable({ providedIn: 'root' })
export class OrganisateurApiService {
  private readonly apiUrl = 'http://localhost:8081/organisateurs';

  constructor(private http: HttpClient) {}

  getOrganisateurs(): Observable<Organisateur[]> {
    return this.http.get<Organisateur[]>(this.apiUrl);
  }

  getOrganisateurById(id: number): Observable<Organisateur> {
    return this.http.get<Organisateur>(`${this.apiUrl}/${id}`);
  }

  createOrganisateur(payload: Organisateur): Observable<Organisateur> {
    return this.http.post<Organisateur>(this.apiUrl, payload);
  }

  updateOrganisateur(id: number, payload: Organisateur): Observable<Organisateur> {
    return this.http.put<Organisateur>(`${this.apiUrl}/${id}`, payload);
  }

  deleteOrganisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
