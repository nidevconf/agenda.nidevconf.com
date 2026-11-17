import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import SiteHeader from "./_components/SiteHeader";
import "./globals.css";

const inter = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });
const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agenda.nidevconf.com"),
  title: {
    default: "My NIDC 2026 Agenda",
    template: "%s | NIDC 2026 Agenda",
  },
  description:
    "Build your day at NIDC 2026 — bookmark the talks you want to see and share your agenda with a link.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "NIDC Agenda",
  },
  openGraph: {
    title: "My NIDC 2026 Agenda",
    description: "Build your day at NIDC 2026 and share your agenda with a link.",
    url: "https://agenda.nidevconf.com",
    siteName: "NIDC 2026 Agenda",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "NIDC 2026 Agenda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My NIDC 2026 Agenda",
    description: "Build your day at NIDC 2026 and share your agenda with a link.",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#EC008C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <script
          dangerouslySetInnerHTML={{
            // dev: no service worker — its cache-first fetch would serve stale pages
            // while editing, so drop any one a previous build registered
            __html:
              process.env.NODE_ENV === "production"
                ? `if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));`
                : `navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));`,
          }}
        />
      </body>
    </html>
  );
}
