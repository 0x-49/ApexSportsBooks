import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSportsbookData } from '../../lib/sportsbooks'

interface PageProps {
  params: {
    sportsbook: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sportsbook = await getSportsbookData(params.sportsbook)
  
  if (!sportsbook) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.'
    }
  }

  return {
    title: `${sportsbook.title} Review - Apex Sportsbooks`,
    description: sportsbook.description,
    openGraph: {
      title: sportsbook.title,
      description: sportsbook.description,
      images: [sportsbook.previewDesktop]
    }
  }
}

export default async function SportsbookPage({ params }: PageProps) {
  const sportsbook = await getSportsbookData(params.sportsbook)

  if (!sportsbook) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1>{sportsbook.title}</h1>
        <div className="flex justify-between items-center">
          <img 
            src={sportsbook.logoIcon} 
            alt={`${sportsbook.name} logo`}
            className="w-32 h-32 object-contain"
          />
          <div className="stats">
            <p>Monthly Visits: {sportsbook.estimatedMonthlyVisitsSep2024}</p>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: sportsbook.content }} />
      </article>
    </main>
  )
}
