import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { CurrencyRatesResponse } from '../../models/currency';
import { environment } from '../../../../environment/environment';
import { currency } from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private http = inject(HttpClient);

  private cache = new Map<string, Observable<CurrencyRatesResponse>>();

  getCurrency(code: string): Observable<CurrencyRatesResponse> {
    const key = code.trim().toUpperCase();
    const cached = this.cache.get(key);
    if (cached) return cached;

    const req$ = this.http
      .get<CurrencyRatesResponse>(
        `${environment.api.currency}${environment.keys.currency}${currency.BY_CURRENCY}${key}`,
      )
      .pipe(
        catchError((err) => {
          this.cache.delete(key);
          return throwError(() => err);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.cache.set(key, req$);
    return req$;
  }
}
