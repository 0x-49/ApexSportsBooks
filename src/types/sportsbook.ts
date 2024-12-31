export interface TopCountry {
  countryName: string;
  countryCode: string; // ISO 3166-1 alpha-2 code
  visitsShare: number;
}

export interface Sportsbook {
  UniqueID: number;
  Name: string;
  Description: string;
  LogoIcon: string;
  URL: string;
  descriptionsURL?: string;
  estimatedMonthlyVisits: { [key: string]: number };
  trafficHistory: { [key: string]: number };
  topCountries: TopCountry[];
  rating?: number;
  founded?: string;
  title: string;
  previewDesktop: string;
  content: string;
  estimatedMonthlyVisitsSep2024: number;
  Flag: string;
  GrowthRate?: number;
}

export interface SportsbookCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  rating: number;
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
