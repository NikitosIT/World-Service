import { Routes } from '@angular/router';
import { CountriesListComponent } from './pages/countries/countries-list/countries-list.component';
import { CountriesInfoComponent } from './pages/countries/countries-info/countries-info.component';
import { WeatherComponent } from './pages/weather/weather.component/weather.component';
import { CurrencyComponent } from './pages/currency/currency.component/currency.component';

export const routes: Routes = [
  { path: '', component: CountriesListComponent },
  { path: 'country/:name', component: CountriesInfoComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'currency', component: CurrencyComponent },
  { path: '**', redirectTo: '/' },
];
