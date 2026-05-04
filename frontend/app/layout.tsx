import ApolloClientProvider from '@/providers/ApolloProvider'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import '../styles/tailwind.css'
import "../styles/style.css"
import { Toaster } from 'sonner'

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "800"] });

// Variables del sitio
const siteTitle = "Sociedad Venezolana de Optometría";
const siteDescription = "Organización gremial sin fines de lucro que impulsa la educación, el ejercicio profesional y el cuidado visual en Venezuela.";
const siteUrl = "https://optometria.nimbux.cloud";
const siteName = "Sociedad Venezolana de Optometría";
const logoImage = `${siteUrl}/iconos/logo-isotipo.png`;
const author = {
  name: "Sociedad Venezolana de Optometría",
  contact: "",
};
const keywords = "optometría, salud visual, gremio, educación, Venezuela, ejercicio profesional";
const locale = "es_VE";

// Configuración de imágenes OG
const imageConfig = {
  url: logoImage,
  width: 1200,
  height: 630,
  alt: "Sociedad Venezolana de Optometría - Cuidado visual en Venezuela",
};

// Configuración de iconos
// Configuración de iconos
const iconConfig = {
  icon: "/iconos/logo.png",
  shortcut: "/iconos/logo.png",
  apple: "/iconos/logo.png",
};

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords,
  authors: [{ name: author.name }],
  creator: author.name,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: siteUrl,
    siteName,
    images: [imageConfig],
    locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [logoImage],
  },
  icons: iconConfig,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script> */}
        <link rel="shortcut icon" href="/iconos/logo-isotipo.png" type="image/x-icon" />
      </head>
      <body className={`${nunito.className} antialiased`}>
        <ApolloClientProvider>
          {children}
          <Toaster
            position="bottom-center"
            richColors={true}
            theme="light"
            expand={false}
            visibleToasts={4}
          />
        </ApolloClientProvider>
      </body>
    </html>
  )
}