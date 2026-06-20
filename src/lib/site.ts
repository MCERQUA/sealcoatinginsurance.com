// Centralized site data — used across nav, footer, schema, CTAs
// Sealcoating Insurance — asphalt sealcoating contractor coverage

import {
  ShieldCheck, Wrench, Truck, HardHat, Droplets, Umbrella, Package, FileCheck,
} from "lucide-react";

export const SITE = {
  name: "Sealcoating Insurance",
  legalName: "Sealcoating Insurance (by Contractors Choice Agency)",
  domain: "sealcoatinginsurance.com",
  url: "https://sealcoatinginsurance.com",
  tagline: "Protect Your Sealcoating Business",
  description:
    "Specialized commercial insurance for sealcoating contractors — GL, tools and equipment, commercial auto for spray trucks, workers' comp, contractor pollution liability, umbrella, inland marine, and bonds. All 50 states. 15-minute quotes.",
  phone: "844-967-5247",
  phoneAlt: "844-967-5247",
  phoneHref: "tel:+18449675247",
  phoneAltHref: "tel:+18449675247",
  email: "josh@contractorschoiceagency.com",
  founded: 2005,
  npn: "8608479",
  address: {
    street: "12220 E Riggs Road, Suite #105",
    city: "Chandler",
    state: "AZ",
    zip: "85249",
    country: "US",
  },
  hours: "Mon–Fri 8am–5pm (MST)",
  claimsSla: "2-hour claims response",
  quoteSla: "15-minute quote turnaround",
  statesLicensed: "All 50 states",
} as const;

// Niche nouns used in headings, metadata, and component copy
export const BRAND = {
  brandShort: "Sealcoating",
  brandSub: "Contractor Insurance",
  nicheShort: "sealcoating contractor",
  nicheShortCap: "Sealcoating Contractor",
  nichePlural: "sealcoating contractors",
  nichePluralCap: "Sealcoating Contractors",
  operator: "sealcoating operation",
  operatorCap: "Sealcoating Operation",
  industry: "sealcoating",
  industryCap: "Sealcoating",
  audience: "sealcoating contractors",
  audienceCap: "Sealcoating Contractors",
  ownerTitle: "sealcoating contractor",
  regionPill: "Texas · Southeast · National",
  serviceSuffix: "Sealcoating Contractors",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Coverage", href: "/coverage" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = [
  {
    slug: "general-liability",
    title: "General Liability for Sealcoating Contractors",
    short: "Protect your business from third-party claims",
    description:
      "The foundation of every sealcoating contractor's insurance program. Covers third-party bodily injury and property damage — parking lot overspray, vehicle damage, trip hazards from crack fill work, and the day-to-day liability of running a sealcoating operation.",
    icon: "ShieldCheck",
    keywords: ["sealcoating general liability", "sealcoating contractor liability insurance", "parking lot contractor GL", "asphalt sealcoating liability"],
  },
  {
    slug: "tools-equipment",
    title: "Tools & Equipment Coverage",
    short: "Sealcoating tanks, spray systems & crack fill machines",
    description:
      "Covers your sealcoating tanks, spray wands, crack fill machines, line stripers, and other tools against theft, damage, and breakdown — whether stored at your shop or on a jobsite. Your spray system is the backbone of your business.",
    icon: "Wrench",
    keywords: ["sealcoating equipment insurance", "sealcoating tools coverage", "spray system insurance", "crack fill machine coverage"],
  },
  {
    slug: "commercial-auto",
    title: "Commercial Auto & Spray Trucks",
    short: "Spray trucks, tankers & crew vehicles",
    description:
      "Coverage for the spray trucks, tanker trucks, crack fill trucks, and crew pickups you run on public roads — including hired and non-owned auto when crew members use their own vehicles on the job.",
    icon: "Truck",
    keywords: ["sealcoating commercial auto insurance", "spray truck insurance", "asphalt contractor truck insurance", "sealcoating vehicle coverage"],
  },
  {
    slug: "workers-compensation",
    title: "Workers' Compensation",
    short: "For sealcoating crews & equipment operators",
    description:
      "Coverage for the real injury patterns in sealcoating work — heat exposure from hot sealant, chemical burns from coal tar, slip-and-fall on freshly sealed lots, back injuries from equipment operation, and on-site accidents.",
    icon: "HardHat",
    keywords: ["sealcoating workers compensation", "asphalt contractor workers comp", "sealcoating crew workers comp", "paving workers compensation"],
  },
  {
    slug: "contractor-pollution-liability",
    title: "Contractor Pollution Liability",
    short: "Coal tar, VOC emissions & sealer runoff",
    description:
      "Covers pollution claims that standard GL excludes — coal tar sealer classified as a pollutant, asphalt sealer VOC runoff into storm drains, chemical spills, and regulatory cleanup orders. Critical for sealcoating contractors in regulated states.",
    icon: "Droplets",
    keywords: ["sealcoating pollution liability", "coal tar sealer insurance", "contractor pollution liability sealcoating", "asphalt sealer environmental coverage"],
  },
  {
    slug: "umbrella",
    title: "Commercial Umbrella",
    short: "Excess limits above your GL for big claims",
    description:
      "Provides excess liability limits above your general liability and commercial auto policies — essential when you work large commercial parking lots, municipal contracts, or HOA properties where a single claim can exceed primary policy limits.",
    icon: "Umbrella",
    keywords: ["sealcoating umbrella insurance", "sealcoating excess liability", "asphalt contractor umbrella coverage", "sealcoating commercial umbrella"],
  },
  {
    slug: "inland-marine",
    title: "Inland Marine Coverage",
    short: "Equipment in transit & at remote jobsites",
    description:
      "Covers sealcoating equipment while in transit to jobsites, stored at remote locations, or rented to others — filling the gap between your commercial auto (which covers the vehicle) and tools & equipment (which covers items at your shop).",
    icon: "Package",
    keywords: ["sealcoating inland marine", "contractor equipment in transit insurance", "sealcoating jobsite equipment coverage", "asphalt contractor inland marine"],
  },
  {
    slug: "bonds",
    title: "Contractor License & Surety Bonds",
    short: "License bonds & performance bonds",
    description:
      "License bonds required by your state or municipality, performance bonds for public and municipal sealcoating contracts, and bid bonds for commercial property management accounts — fast placement for sealcoating contractors.",
    icon: "FileCheck",
    keywords: ["sealcoating contractor bond", "sealcoating license bond", "asphalt contractor surety bond", "sealcoating performance bond"],
  },
] as const;

export const LOCATIONS = [
  { slug: "texas-southwest", name: "Texas & Southwest", region: "TX · AZ · NM · OK", blurb: "The Southwest is one of the largest parking lot sealcoating markets in the country. Hot, dry climate accelerates asphalt oxidation and speeds sealcoat cure — driving high annual demand from commercial property managers, HOAs, and municipalities. We write sealcoating contractor programs for Texas, Arizona, New Mexico, and Oklahoma operations." },
  { slug: "southeast", name: "Southeast", region: "FL · GA · NC · SC", blurb: "Year-round sealcoating season and a booming HOA and commercial market across Florida, Georgia, and the Carolinas. Southeast sealcoating contractors face heavy demand from retirement communities, shopping centers, and property management companies. We place full sealcoating insurance programs for contractors across the region." },
  { slug: "midwest", name: "Midwest", region: "IL · OH · MI · IN", blurb: "Freeze-thaw cycles in the Midwest crack asphalt faster than almost anywhere in the country — driving one of the highest per-capita sealcoating demands nationally. Illinois, Ohio, Michigan, and Indiana contractors stay busy all season. We insure Midwest sealcoating operations with GL, equipment, auto, workers' comp, and pollution coverage." },
  { slug: "northeast", name: "Northeast", region: "NY · PA · NJ · CT", blurb: "Dense commercial real estate, municipal infrastructure, and large institutional property portfolios make the Northeast a massive sealcoating market. New York, Pennsylvania, New Jersey, and Connecticut contractors compete for commercial accounts with strict insurance requirements. We build programs that satisfy large property managers and municipal bid specs." },
  { slug: "california", name: "California", region: "CA · Pacific Coast", blurb: "California's strict VOC regulations for sealcoating products have shifted most contractors to asphalt-based sealer formulations. Coastal and inland markets remain strong for parking lot maintenance. We insure California sealcoating contractors with pollution liability structured for the state's environmental standards." },
  { slug: "mountain-states", name: "Mountain States", region: "CO · UT · WY · ID", blurb: "Short sealcoating seasons in Colorado, Utah, Wyoming, and Idaho mean contractors run at full capacity all summer handling commercial, HOA, and municipal work. High-altitude UV exposure accelerates asphalt degradation, increasing demand for annual sealcoating cycles. We place fast programs for Mountain States contractors." },
  { slug: "mid-atlantic", name: "Mid-Atlantic", region: "VA · MD · DC · DE", blurb: "Government facilities, large federal office campuses, military installations, and dense commercial complexes across Virginia, Maryland, DC, and Delaware generate significant sealcoating demand. Contractors in this region frequently need performance bonds and high-limit GL to satisfy government and institutional bid requirements." },
  { slug: "pacific-northwest", name: "Pacific Northwest", region: "WA · OR", blurb: "Wet climate and year-round temperature swings in Washington and Oregon keep asphalt in constant need of maintenance. Pacific Northwest sealcoating contractors balance a shorter dry-weather window with high commercial and municipal demand. We write programs for PNW contractors including pollution coverage for rain-driven sealer runoff concerns." },
] as const;

export const CREDENTIALS = [
  { label: "Licensed in all 50 states", icon: "MapPin" },
  { label: "Founded 2005 — 20+ years", icon: "CalendarCheck" },
  { label: "Sealcoating-knowledgeable agents", icon: "HardHat" },
  { label: "15-minute quote turnaround", icon: "Timer" },
  { label: "2-hour claims response", icon: "Zap" },
  { label: "A.M. Best A+ carrier partners", icon: "Award" },
] as const;

export const STATS = [
  { value: 500, suffix: "+", label: "Sealcoating contractors insured nationwide", prefix: "" },
  { value: 20, suffix: "+", label: "Years insuring contractor operations", prefix: "" },
  { value: 15, suffix: " min", label: "Average quote turnaround", prefix: "" },
  { value: 50, suffix: "", label: "States licensed & writing", prefix: "" },
] as const;

export const TESTIMONIALS = [
  { quote: "We landed a big HOA contract — 47 lots, tight timeline. The property manager required $2M GL and additional insured status on the certificate before we could start. CCA had the cert to me in under an hour. That's the kind of support that wins you jobs.", name: "Marcus T.", role: "Owner, M&T Sealcoating", location: "Texas" },
  { quote: "My spray truck got rear-ended on the way to a job — loaded tank, full crew. Commercial auto paid out fast, covered the vehicle, and we got back to work without the nightmare I expected. These guys actually know what sealcoating contractors do.", name: "Dave R.", role: "Operations Manager", location: "Ohio" },
  { quote: "We had a coal tar sealer claim — runoff into a storm drain on a commercial lot job. Standard GL denied it as a pollution exclusion. CCA had contractor pollution liability on our policy and the claim was covered. That saved my business.", name: "Lynn K.", role: "Sole Proprietor, LK Asphalt Services", location: "Pennsylvania" },
] as const;
