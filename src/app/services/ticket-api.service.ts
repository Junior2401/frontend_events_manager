import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';

@Injectable({ providedIn: 'root' })
export class TicketApiService {
  private readonly apiUrl = 'http://localhost:8081/tickets';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(payload: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, payload);
  }

  updateTicket(id: number, payload: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
