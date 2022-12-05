import fullCountries from './countries.json';

export const countries = fullCountries
  .map((c) => ({
    name: c.name.common,
    code: c.cca2,
    region: c.subregion,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
