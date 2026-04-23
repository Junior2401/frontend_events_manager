import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeEvenement } from '../models/type-evenement';

@Injectable({ providedIn: 'root' })
export class TypeEvenementApiService {
  private readonly apiUrl = 'http://localhost:8081/type_evenements';

  constructor(private http: HttpClient) {}

  getTypeEvenements(): Observable<TypeEvenement[]> {
    return this.http.get<TypeEvenement[]>(this.apiUrl);
  }

  getTypeEvenementById(id: number | undefined): Observable<TypeEvenement> {
    return this.http.get<TypeEvenement>(`${this.apiUrl}/${id}`)
  }

  createTypeEvenement(payload: TypeEvenement): Observable<TypeEvenement> {
    return this.http.post<TypeEvenement>(this.apiUrl, payload)
  }

  updateTypeEvenement(id: number, payload: TypeEvenement): Observable<TypeEvenement> {
    return this.http.put<TypeEvenement>(`${this.apiUrl}/${id}`, payload)
  }

  deleteTypeEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
