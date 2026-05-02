import ApolloClientProvider from '@/providers/ApolloProvider'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import '../styles/tailwind.css'
import { Toaster } from 'sonner'

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "800"] });

// Variables del sitio
const siteTitle = "Biblioteca - Gestión de Libros";
const siteDescription = "CRUD de libros con vista tarjeta y tabla";
const siteUrl = "https://biblioteca.tudominio.com";
const siteName = "Biblioteca";
const logoImage = `${siteUrl}/og-image.png`;
const author = {
  name: "Tu Nombre",
  contact: "+580000000000",
};
const keywords = "biblioteca, libros, gestión, CRUD";
const locale = "es_VE";

// Configuración de imágenes OG
const imageConfig = {
  url: logoImage,
  width: 1200,
  height: 630,
  alt: "Biblioteca - Sistema de Gestión de Libros",
};

// Configuración de iconos
const iconConfig = {
  icon: [
    { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
    { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    { url: '/icon.svg', type: 'image/svg+xml' },
  ],
  shortcut: "/icon-light-32x32.png",
  apple: "/apple-icon.png",
};

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords,
  authors: [{ name: `${author.name}, contacto: ${author.contact}` }],
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
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
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