import { Sportsbook } from '../types/sportsbook';

export interface GrowthRate {
  sportsbook: Sportsbook;
  growthRate: number;
  previousTraffic: number;
  currentTraffic: number;
}

export interface CountryTraffic {
  sportsbook: Sportsbook;
  countryTraffic: number;
  countryShare: number;
}

export function calculateGrowthRates(sportsbooks: Sportsbook[], months: 1 | 2 = 1): GrowthRate[] {
  return sportsbooks.map(sportsbook => {
    const visits = Object.entries(sportsbook.estimatedMonthlyVisits || {})
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

    if (visits.length < months + 1) {
      return { sportsbook, growthRate: 0, previousTraffic: 0, currentTraffic: 0 };
    }

    const currentTraffic = visits[0][1];
    const previousTraffic = visits[months][1];
    const growthRate = ((currentTraffic - previousTraffic) / previousTraffic) * 100;

    return {
      sportsbook,
      growthRate,
      previousTraffic,
      currentTraffic
    };
  }).sort((a, b) => b.growthRate - a.growthRate);
}

export function getCountrySpecificTraffic(sportsbooks: Sportsbook[], countryName: string): CountryTraffic[] {
  return sportsbooks
    .map(sportsbook => {
      const latestTraffic = Object.entries(sportsbook.estimatedMonthlyVisits || {})
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())[0]?.[1] || 0;

      const countryData = sportsbook.topCountries?.find(
        country => country.countryName.toLowerCase() === countryName.toLowerCase()
      );

      const countryShare = countryData?.visitsShare || 0;
      const countryTraffic = latestTraffic * countryShare;

      return {
        sportsbook,
        countryTraffic,
        countryShare
      };
    })
    .filter(item => item.countryTraffic > 0)
    .sort((a, b) => b.countryTraffic - a.countryTraffic);
}

export function getAllCountries(sportsbooks: Sportsbook[]): string[] {
  const countries = new Set<string>();
  sportsbooks.forEach(sportsbook => {
    sportsbook.topCountries?.forEach(country => {
      if (country.visitsShare > 0) {
        countries.add(country.countryName);
      }
    });
  });
  return Array.from(countries).sort();
}

export function formatTraffic(traffic: number): string {
  if (traffic >= 1_000_000) {
    return `${(traffic / 1_000_000).toFixed(1)}M`;
  } else if (traffic >= 1_000) {
    return `${(traffic / 1_000).toFixed(1)}K`;
  }
  return traffic.toString();
}
