import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { countries } from '../../constants/constants';
import { map, Observable, shareReplay } from 'rxjs';
import { Countries, Country } from '../../models/countries';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private http = inject(HttpClient);

  private allCountries$?: Observable<Countries>;

  getCountries(): Observable<Countries> {
    if (!this.allCountries$) {
      this.allCountries$ = this.http
        .get<Countries>(`${environment.api.countries}${countries.ALL_COUNTRIES}`)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.allCountries$;
  }
  getCountryByName(name: string): Observable<Country | null> {
    return this.http
      .get<Countries>(`${environment.api.countries}${countries.BY_NAME}${name}`)
      .pipe(map((list) => list[0] ?? null));
  }
}
