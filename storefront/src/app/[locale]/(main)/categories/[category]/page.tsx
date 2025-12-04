import { Metadata } from "next"
import { getCategoryByHandle } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import { headers } from "next/headers"
import { toHreflang } from "@/lib/helpers/hreflang"

type Country = { iso_2: string }
type Region = { countries?: Country[] }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>
}): Promise<Metadata> {
  const { category, locale } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const cat = await getCategoryByHandle([category])
  if (!cat) {
    return {}
  }

  let languages: Record<string, string> = {}

  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || []).flatMap((r: Region) =>
          r.countries?.map((c: Country) => c.iso_2) || []
        )
      )
    ) as string[]

    languages = locales.reduce<Record<string, string>>((acc, code) => {
      acc[toHreflang(code)] = `${baseUrl}/${code}/categories/${cat.handle}`
      return acc
    }, {})
  } catch {
    languages = {
      [toHreflang(locale)]: `${baseUrl}/${locale}/categories/${cat.handle}`,
    }
  }

  const title = `${cat.name} Category`
  const description = `${cat.name} Category - ${
    process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"
  }`
  const canonical = `${baseUrl}/${locale}/categories/${cat.handle}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": `${baseUrl}/categories/${cat.handle}`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`,
      description,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Storefront",
      type: "website",
    },
  }
}
