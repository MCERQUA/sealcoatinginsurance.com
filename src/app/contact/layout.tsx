import type { Metadata } from "next";

// Segment layout ONLY to carry the canonical. src/app/contact/page.tsx is a
// "use client" component, and Next IGNORES a metadata export from a client
// component — a page-level insert compiles, passes the gate, deploys and changes
// nothing. A layout is a server component, so the metadata is honoured.
//
// Only `alternates` is set: title and description still inherit from the root
// layout. The ROOT canonical (SITE.url) is correct for the homepage and is not
// touched — removing it would strip a right answer to fix a wrong one.
export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
