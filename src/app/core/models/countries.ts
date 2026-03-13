interface CountryName {
  common: string;
  official: string;
}

interface Flag {
  svg: string;
  png: string;
}

export interface Country {
  name: CountryName;
  capital: string[];
  region: string;
  population: number;
  flags: Flag;
  independent: boolean;
}

export type Countries = Country[];
