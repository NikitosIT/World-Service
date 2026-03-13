import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountriesService } from '../../../core/services/countries/countries.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Country } from '../../../core/models/countries';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-countries-info',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './countries-info.component.html',
  styleUrl: './countries-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesInfoComponent {
  private route = inject(ActivatedRoute);
  private countriesService = inject(CountriesService);

  country = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => this.countriesService.getCountryByName(params.get('name')!)),
    ),
    { initialValue: null as Country | null },
  );
}
