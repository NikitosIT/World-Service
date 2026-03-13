import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CountriesService } from '../../../core/services/countries/countries.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs';
import { Countries } from '../../../core/models/countries';
import { toSignal } from '@angular/core/rxjs-interop';
import { REGIONS } from '../../../core/constants/constants';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-countries-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesListComponent {
  regions = REGIONS;

  private countriesService = inject(CountriesService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(true);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
    regionControl: [this.route.snapshot.queryParams['region'] ?? ''],
  });

  countries$ = toSignal(
    this.countriesService.getCountries().pipe(tap(() => this.loading.set(false))),
    { initialValue: [] as Countries },
  );

  formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue()), distinctUntilChanged()),
    { initialValue: this.form.getRawValue() },
  );

  private queryRegion = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('region') ?? '')),
    { initialValue: '' },
  );

  private syncRegionToQuery = effect(() => {
    const { regionControl } = this.formValue();

    const region = regionControl!.trim();
    const current = this.queryRegion();

    if (region === current) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { region: region || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  filteredCountries = computed(() => {
    const { name, regionControl } = this.formValue();

    const nameTerm = name!.trim().toLowerCase();
    const region = regionControl.trim();

    return this.countries$()
      .filter((c) => !nameTerm || c.name.common.toLowerCase().includes(nameTerm))
      .filter((c) => !region || c.region === region);
  });
}
