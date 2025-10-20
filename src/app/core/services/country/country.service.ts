import { Injectable } from '@angular/core';
import countriesRaw from 'world-countries';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private dn = new Intl.DisplayNames(['es'], { type: 'region' });
  constructor() { }

  getFullList(): any[] {
    return countriesRaw;
  }

  getCountriesNames(): string[] {
    const names = countriesRaw.map(c => c.name.common);
    return names;
  }

  getCountriesNamesES(): string[] {
    const names = countriesRaw.map(
      c => c.translations?.['spa']?.official ?? this.dn.of(c.cca2) ?? c.name.official
    );
    return names;
  }

}
