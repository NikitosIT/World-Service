import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../../models/weather';
import { environment } from '../../../../environment/environment';
import { weather } from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  getWeather(city: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${environment.api.weather}${environment.keys.weather}${weather.BY_NAME}${encodeURIComponent(city)}`,
    );
  }
}
