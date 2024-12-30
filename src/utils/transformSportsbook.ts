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

  // Extract traffic history
  const trafficHistory: { [key: string]: number } = {};
  Object.keys(rawData).forEach(key => {
    if (key.startsWith('trafficHistory/')) {
      const date = key.replace('trafficHistory/', '');
      trafficHistory[date] = rawData[key];
    }
  });

  return {
    UniqueID: rawData.UniqueID,
    Name: rawData.Name,
    Description: rawData.Description,
    LogoIcon: rawData.LogoIcon,
    URL: rawData.URL,
    descriptionsURL: rawData['descriptions URL'],
    estimatedMonthlyVisits,
    trafficHistory,
    topCountries,
    title: rawData.Name,
    previewDesktop: rawData.LogoIcon,
    content: rawData.Description,
    estimatedMonthlyVisitsSep2024: estimatedMonthlyVisits['2024-09'] || 0,
    Flag: rawData.Flag || ''
  };
}
