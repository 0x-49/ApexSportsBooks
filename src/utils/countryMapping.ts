// Maps country names to their ISO 3166-1 alpha-2 codes
export const countryToCode: { [key: string]: string } = {
  'Afghanistan': 'af',
  'Albania': 'al',
  'Algeria': 'dz',
  'Andorra': 'ad',
  'Angola': 'ao',
  'Argentina': 'ar',
  'Armenia': 'am',
  'Australia': 'au',
  'Austria': 'at',
  'Azerbaijan': 'az',
  'Bahamas': 'bs',
  'Bahrain': 'bh',
  'Bangladesh': 'bd',
  'Belarus': 'by',
  'Belgium': 'be',
  'Belize': 'bz',
  'Bolivia': 'bo',
  'Bosnia and Herzegovina': 'ba',
  'Brazil': 'br',
  'Bulgaria': 'bg',
  'Cambodia': 'kh',
  'Cameroon': 'cm',
  'Canada': 'ca',
  'Chile': 'cl',
  'China': 'cn',
  'Colombia': 'co',
  'Costa Rica': 'cr',
  'Croatia': 'hr',
  'Cuba': 'cu',
  'Cyprus': 'cy',
  'Czech Republic': 'cz',
  'Denmark': 'dk',
  'Dominican Republic': 'do',
  'Ecuador': 'ec',
  'Egypt': 'eg',
  'El Salvador': 'sv',
  'Estonia': 'ee',
  'Ethiopia': 'et',
  'Finland': 'fi',
  'France': 'fr',
  'Georgia': 'ge',
  'Germany': 'de',
  'Ghana': 'gh',
  'Greece': 'gr',
  'Guatemala': 'gt',
  'Haiti': 'ht',
  'Honduras': 'hn',
  'Hong Kong': 'hk',
  'Hungary': 'hu',
  'Iceland': 'is',
  'India': 'in',
  'Indonesia': 'id',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Ireland': 'ie',
  'Israel': 'il',
  'Italy': 'it',
  'Jamaica': 'jm',
  'Japan': 'jp',
  'Jordan': 'jo',
  'Kazakhstan': 'kz',
  'Kenya': 'ke',
  'Kuwait': 'kw',
  'Kyrgyzstan': 'kg',
  'Latvia': 'lv',
  'Lebanon': 'lb',
  'Libya': 'ly',
  'Liechtenstein': 'li',
  'Lithuania': 'lt',
  'Luxembourg': 'lu',
  'Macau': 'mo',
  'Macedonia': 'mk',
  'Madagascar': 'mg',
  'Malaysia': 'my',
  'Malta': 'mt',
  'Mexico': 'mx',
  'Moldova': 'md',
  'Monaco': 'mc',
  'Mongolia': 'mn',
  'Montenegro': 'me',
  'Morocco': 'ma',
  'Myanmar': 'mm',
  'Nepal': 'np',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'Nicaragua': 'ni',
  'Nigeria': 'ng',
  'North Korea': 'kp',
  'Norway': 'no',
  'Oman': 'om',
  'Pakistan': 'pk',
  'Palestine': 'ps',
  'Panama': 'pa',
  'Paraguay': 'py',
  'Peru': 'pe',
  'Philippines': 'ph',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Puerto Rico': 'pr',
  'Qatar': 'qa',
  'Romania': 'ro',
  'Russia': 'ru',
  'Saudi Arabia': 'sa',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'Singapore': 'sg',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'Somalia': 'so',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Spain': 'es',
  'Sri Lanka': 'lk',
  'Sudan': 'sd',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Syria': 'sy',
  'Taiwan': 'tw',
  'Tajikistan': 'tj',
  'Tanzania': 'tz',
  'Thailand': 'th',
  'Tunisia': 'tn',
  'Turkey': 'tr',
  'Turkmenistan': 'tm',
  'Uganda': 'ug',
  'Ukraine': 'ua',
  'United Arab Emirates': 'ae',
  'United Kingdom': 'gb',
  'United States': 'us',
  'Uruguay': 'uy',
  'Uzbekistan': 'uz',
  'Vatican City': 'va',
  'Venezuela': 've',
  'Vietnam': 'vn',
  'Yemen': 'ye',
  'Zambia': 'zm',
  'Zimbabwe': 'zw'
};

export function getCountryCode(countryName: string): string {
  // Handle common variations
  const normalizedName = countryName
    .trim()
    .replace(/^The /, '')  // Remove leading "The "
    .replace(/ of.*$/, '') // Remove "of" and anything after
    .replace(/\s+/g, ' '); // Normalize spaces

  // Direct lookup
  if (countryToCode[normalizedName]) {
    return countryToCode[normalizedName];
  }

  // Try case-insensitive lookup
  const lowerName = normalizedName.toLowerCase();
  const match = Object.keys(countryToCode).find(
    key => key.toLowerCase() === lowerName
  );
  
  if (match) {
    return countryToCode[match];
  }

  // Special cases
  const specialCases: { [key: string]: string } = {
    'UK': 'gb',
    'USA': 'us',
    'United States of America': 'us',
    'Britain': 'gb',
    'Great Britain': 'gb',
    'Republic of Korea': 'kr',
    'Republic of China': 'tw',
    'Czech': 'cz',
    'Slovak': 'sk'
  };

  if (specialCases[normalizedName]) {
    return specialCases[normalizedName];
  }

  // Return empty string if no match found
  return '';
}
