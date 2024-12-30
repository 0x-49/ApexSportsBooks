export interface TopCountry {
  countryName: string;
  visitsShare: number;
}

export interface Sportsbook {
  Name: string;
  Description: string;
  LogoIcon: string;
  URL: string;
  descriptionsURL?: string;
  estimatedMonthlyVisits: { [key: string]: number };
  topCountries: TopCountry[];
  rating?: number;
  founded?: string;
}

export interface SportsbookCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  descriptionsURL?: string;
  estimatedMonthlyVisits: { [key: string]: number };
  topCountries: TopCountry[];
  showCountryTraffic?: boolean;
  country?: string;
}

export interface AllSportsbooksProps {
  sportsbooks: Sportsbook[];
  sortBy?: 'traffic' | 'growth' | 'name';
}

export interface CountrySportsbooksProps {
  sportsbooks: Sportsbook[];
  country?: string;
}
