import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trade } from '../models/trade';

@Injectable({ //comment: This decorator marks the class as a service that can be injected into other components or services. The providedIn: 'root
  providedIn: 'root'
})
export class TradeService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:44389/api/trades';

  getTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.apiUrl);
  }
}