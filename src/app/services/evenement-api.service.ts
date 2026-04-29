import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement';
import { TypeEvenement } from '../models/type-evenement';
import { Artiste } from '../models/artiste';
import { Organisateur } from '../models/organisateur';

@Injectable({ providedIn: 'root' })
export class EvenementApiService {
  private readonly apiUrl = 'http://localhost:8081/evenements';

  constructor(private http: HttpClient) {}

  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.apiUrl);
  }

  getEvenementById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.apiUrl}/${id}`);
  }

  getTypeEvenement(id: number): Observable<TypeEvenement> {
    return this.http.get<TypeEvenement>(`${this.apiUrl}/${id}/type`);
  }

  getArtistesByEvenement(id: number): Observable<Artiste[]> {
    return this.http.get<Artiste[]>(`${this.apiUrl}/${id}/artistes`);
  }

  getOrganisateursByEvenement(id: number): Observable<Organisateur[]> {
    return this.http.get<Organisateur[]>(`${this.apiUrl}/${id}/organisateurs`);
  }

  createEvenement(payload: Evenement): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, payload);
  }

  updateEvenement(id: number, payload: Evenement): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Gestion des artistes
  addArtisteToEvenement(evenementId: number, artisteId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${evenementId}/artistes/${artisteId}`, {});
  }

  removeArtisteFromEvenement(evenementId: number, artisteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${evenementId}/artistes/${artisteId}`);
  }

  // Gestion des organisateurs
  addOrganisateurToEvenement(evenementId: number, organisateurId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${evenementId}/organisateurs/${organisateurId}`, {});
  }

  removeOrganisateurFromEvenement(evenementId: number, organisateurId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${evenementId}/organisateurs/${organisateurId}`);
  }
}
