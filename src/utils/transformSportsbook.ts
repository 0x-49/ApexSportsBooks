import { Sportsbook, TopCountry } from '../types/sportsbook';
import { getCountryCode } from './countryMapping';

export function transformSportsbook(rawData: any): Sportsbook {
  // Extract monthly visits
  const estimatedMonthlyVisits: { [key: string]: number } = {};
  Object.keys(rawData).forEach(key => {
    if (key.startsWith('estimatedMonthlyVisits/')) {
      const date = key.replace('estimatedMonthlyVisits/', '');
      estimatedMonthlyVisits[date] = rawData[key];
    }
  });

  // Calculate growth rate
  const dates = Object.keys(estimatedMonthlyVisits).sort();
  let growthRate = 0;
  if (dates.length >= 2) {
    const currentMonth = estimatedMonthlyVisits[dates[dates.length - 1]];
    const previousMonth = estimatedMonthlyVisits[dates[dates.length - 2]];
    if (previousMonth > 0) {
      growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;
    }
  }

  // Extract top countries
  const topCountries: TopCountry[] = [];
  let countryIndex = 0;
  while (rawData[`topCountries/${countryIndex}/countryName`]) {
    const countryName = rawData[`topCountries/${countryIndex}/countryName`];
    topCountries.push({
      countryName,
      countryCode: rawData[`topCountries/${countryIndex}/countryCode`] || getCountryCode(countryName),
      visitsShare: rawData[`topCountries/${countryIndex}/visitsShare`] || 0
    });
    countryIndex++;
  }

  // Get current monthly visits
  const currentMonthlyVisits = dates.length > 0 ? estimatedMonthlyVisits[dates[dates.length - 1]] : 0;

  return {
    UniqueID: rawData.UniqueID,
    Name: rawData.Name,
    Description: rawData.Description,
    LogoIcon: rawData.LogoIcon,
    URL: rawData.URL,
    descriptionsURL: rawData['descriptions URL'],
    estimatedMonthlyVisits,
    trafficHistory: estimatedMonthlyVisits,
    topCountries,
    rating: rawData.rating || 0,
    founded: rawData.founded,
    title: rawData.Name,
    previewDesktop: rawData.LogoIcon,
    content: rawData.Description,
    estimatedMonthlyVisitsSep2024: currentMonthlyVisits,
    Flag: rawData.Flag || '',
    GrowthRate: Number(growthRate.toFixed(1))
  };
}
