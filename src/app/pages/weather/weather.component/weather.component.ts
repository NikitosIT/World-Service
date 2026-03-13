import { Component, inject, signal } from '@angular/core';
import { WeatherService } from '../../../core/services/weather/weather.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-weather',
  imports: [ReactiveFormsModule, AsyncPipe, DecimalPipe],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  private weatherService = inject(WeatherService);
  loading = signal(false);
  error = signal<string | null>(null);

  form = new FormControl('', {
    nonNullable: true,
    validators: [Validators.pattern(/^[A-Za-z\s]+$/)],
  });

  filterWeather$ = this.form.valueChanges.pipe(
    debounceTime(800),
    map((city) => city.trim()),
    distinctUntilChanged(),
    map((city) => {
      this.error.set(null);
      return city;
    }),
    filter(() => this.form.valid && !!this.form.value),
    switchMap((city) => {
      this.loading.set(true);
      return this.weatherService.getWeather(city).pipe(
        map((resp) => {
          this.loading.set(false);
          return resp;
        }),
        catchError(() => {
          this.loading.set(false);
          this.error.set('City not found');
          return of(null);
        }),
      );
    }),
  );
}
