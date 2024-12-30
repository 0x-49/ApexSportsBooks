import { Sportsbook } from '../types/sportsbook';

export async function getSportsbookContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error fetching sportsbook content:', error);
    return '';
  }
}

export function transformSportsbookContent(content: string): {
  data: Record<string, any>;
  content: string;
} {
  // Simple frontmatter parser
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      data: {},
      content: content
    };
  }

  const frontmatter = match[1];
  const mainContent = content.replace(frontmatterRegex, '').trim();

  // Parse frontmatter
  const data: Record<string, any> = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...values] = line.split(':');
    if (key && values.length) {
      data[key.trim()] = values.join(':').trim();
    }
  });

  return {
    data,
    content: mainContent
  };
}

export async function getAllSportsbooks(): Promise<Sportsbook[]> {
  // This would typically fetch from an API or database
  // For now, we'll return an empty array as the data should come from props
  return [];
}

export async function getSportsbookByName(name: string): Promise<Sportsbook | null> {
  const sportsbooks = await getAllSportsbooks();
  return sportsbooks.find(s => s.Name.toLowerCase() === name.toLowerCase()) || null;
}

export async function getSportsbookData(name: string): Promise<Sportsbook | null> {
  const sportsbook = await getSportsbookByName(name);
  
  if (!sportsbook) {
    return null;
  }

  return {
    ...sportsbook,
    title: sportsbook.Name,
    Description: sportsbook.Description,
    previewDesktop: sportsbook.LogoIcon,
    LogoIcon: sportsbook.LogoIcon,
    content: sportsbook.Description,
    estimatedMonthlyVisitsSep2024: sportsbook.estimatedMonthlyVisits?.['2024-09'] || 0
  };
}
