import type { Metadata } from "next";
import { headingFont, bodyFont } from "@/lib/fonts";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Contractors Choice Agency`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "sealcoating insurance",
    "sealcoating contractor insurance",
    "asphalt sealcoating insurance",
    "parking lot sealcoating insurance",
    "sealcoating general liability",
    "asphalt sealer contractor insurance",
    "sealcoating workers compensation",
    "sealcoating commercial auto",
    "sealcoating tools equipment insurance",
    "contractor pollution liability sealcoating",
    "sealcoating umbrella insurance",
    "parking lot contractor insurance",
  ],
  authors: [{ name: "Contractors Choice Agency" }],
  creator: "Contractors Choice Agency",
  publisher: "Contractors Choice Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Contractors Choice Agency`,
    description:
      "Specialized insurance for sealcoating contractors — general liability, tools and equipment, commercial auto for spray trucks, workers' comp, contractor pollution liability, umbrella, inland marine, and bonds. Licensed all 50 states. 15-min quotes.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: `${SITE.name} — sealcoating contractor coverage` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Contractors Choice Agency`,
    description:
      "Specialized insurance for sealcoating contractors. GL, tools and equipment, spray truck auto, workers' comp, pollution liability, umbrella, inland marine, and bonds. 15-minute quotes.",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE.url },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: "+18449675247",
    email: SITE.email,
    image: `${SITE.url}/images/og-image.jpg`,
    logo: `${SITE.url}/images/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: 33.2622, longitude: -111.7826 },
    employee: { "@type": "Person", name: "Josh Cotner", jobTitle: "Founder & Insurance Agent" },
    areaServed: { "@type": "Country", name: "United States" },
    serviceType: [
      "General Liability Insurance for Sealcoating Contractors",
      "Tools & Equipment Coverage for Sealcoating Operations",
      "Commercial Auto Insurance for Spray Trucks",
      "Workers' Compensation for Sealcoating Crews",
      "Contractor Pollution Liability for Asphalt Sealer",
      "Commercial Umbrella Insurance for Sealcoating Contractors",
      "Inland Marine Coverage for Sealcoating Equipment",
      "Contractor License & Surety Bonds",
    ],
  };

  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
