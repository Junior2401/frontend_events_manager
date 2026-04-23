import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement';

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

  createEvenement(payload: Evenement): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, payload);
  }

  updateEvenement(id: number, payload: Evenement): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
