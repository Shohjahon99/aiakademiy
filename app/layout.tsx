import type { Metadata } from "next"
import { Nunito, Raleway } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["700", "900"],
})

export const metadata: Metadata = {
  title: "AIAkademiy.uz — O'zbekistondagi №1 Onlayn Ta'lim Platformasi",
  description:
    "Bugalteriya, Sun'iy intellekt, IT, Marketing va 50+ yo'nalishda professional sertifikatli kurslar. O'z tezligingizda o'rganing.",
  keywords: "online kurslar, bugalteriya, AI, dasturlash, 1C, Python, uzbekistan",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" className={`${nunito.variable} ${raleway.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
