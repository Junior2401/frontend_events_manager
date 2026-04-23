import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artiste } from '../models/artiste';

@Injectable({ providedIn: 'root' })
export class ArtisteApiService {
  private readonly apiUrl = 'http://localhost:8081/artistes';

  constructor(private http: HttpClient) {}

  getArtistes(): Observable<Artiste[]> {
    return this.http.get<Artiste[]>(this.apiUrl);
  }

  getArtisteById(id: number): Observable<Artiste> {
    return this.http.get<Artiste>(`${this.apiUrl}/${id}`);
  }

  createArtiste(payload: Artiste): Observable<Artiste> {
    return this.http.post<Artiste>(this.apiUrl, payload);
  }

  updateArtiste(id: number, payload: Artiste): Observable<Artiste> {
    return this.http.put<Artiste>(`${this.apiUrl}/${id}`, payload);
  }

  deleteArtiste(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
