export interface MetaData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogType: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

type SchemaType = 'Sportsbook' | 'Country' | 'Organization' | 'ItemList';

export function generateCountryMetadata(countryName: string, totalSportsbooks: number): MetaData {
  const title = `Top ${totalSportsbooks} Sportsbooks in ${countryName} - Complete Guide`;
  const description = `Compare the best sports betting sites in ${countryName}. In-depth analysis of ${totalSportsbooks} licensed sportsbooks with local traffic data.`;
  const keywords = [
    `${countryName} sportsbooks`,
    `betting sites ${countryName}`,
    'sports betting',
    'online betting',
    `best sportsbooks ${countryName}`,
    `${countryName} betting sites`,
    'sports betting sites',
    'online sportsbooks',
    `legal betting sites ${countryName}`,
    'betting comparison'
  ];
  
  return {
    title,
    description,
    keywords,
    canonicalUrl: `/top-sportsbooks-in-${countryName.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website'
  };
}

export function generateSportsbookMetadata(
  sportsbookName: string,
  monthlyVisits: number,
  topCountries: string[]
): MetaData {
  const title = `${sportsbookName} Review - Trusted Sportsbook Analysis`;
  const description = `Detailed review of ${sportsbookName}. Monthly traffic: ${formatTraffic(monthlyVisits)}. Available in: ${topCountries.join(', ')}`;
  const keywords = [
    `${sportsbookName} review`,
    `${sportsbookName} betting`,
    `${sportsbookName} sportsbook`,
    'sports betting',
    'online betting',
    'sportsbook review',
    'betting site review',
    'sports betting review',
    `${sportsbookName} bonus`,
    `${sportsbookName} rating`,
    ...topCountries.map(c => c.toLowerCase())
  ];

  return {
    title,
    description,
    keywords,
    canonicalUrl: `/review/${sportsbookName.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'website'
  };
}

export function generateStructuredData(type: SchemaType, data: any): StructuredData {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  return {
    ...baseSchema,
    ...data
  };
}

function formatTraffic(traffic: number): string {
  if (traffic >= 1000000) {
    return `${(traffic / 1000000).toFixed(1)}M`;
  }
  if (traffic >= 1000) {
    return `${(traffic / 1000).toFixed(1)}K`;
  }
  return traffic.toString();
}
