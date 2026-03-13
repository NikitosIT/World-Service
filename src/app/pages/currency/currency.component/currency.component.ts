import { Component, inject, Signal, signal } from '@angular/core';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyRatesResponse } from '../../../core/models/currency';
import { DecimalPipe } from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-currency',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
})
export class CurrencyComponent {
  private currencyService = inject(CurrencyService);
  loading = signal(false);
  error = signal<string | null>(null);

  form = new FormControl('USD', {
    nonNullable: true,
    validators: [Validators.pattern(/^[A-Za-z]{3}$/)],
  });

  filtered$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    map((v) => v.trim().toUpperCase()),
    tap(() => this.error.set(null)),
    debounceTime(500),
    distinctUntilChanged(),
    filter(() => this.form.valid),
    switchMap((code) => {
      this.loading.set(true);
      return this.currencyService.getCurrency(code).pipe(
        tap(() => this.loading.set(false)),
        catchError(() => {
          this.loading.set(false);
          this.error.set('Currency does not exist');
          return of(null);
        }),
      );
    }),
  );

  currency = toSignal(this.filtered$, {
    initialValue: null as CurrencyRatesResponse | null,
  });
  conversionEntries(data: CurrencyRatesResponse): { code: string; rate: number }[] {
    return Object.entries(data.conversion_rates).map(([code, rate]) => ({ code, rate }));
  }
}
