import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import '../src/index.css'
import '../src/digimark-theme.css'
import '../src/digimark-pages.css'
import '../src/App.css'
import '../src/page-banner.css'
import '../src/site-theme.css'
import '../src/plutus-palette.css'
import '../src/our-expertise.css'
import '../src/seo-page.css'
import '../src/political-page.css'
import '../src/components/ClientLogoSection.css'

import TopNav from '../src/components/TopNav'
import Footer from '../src/components/Footer'
import ClientRouterWrapper from '../src/ClientRouterWrapper'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 })
  }, [])

  return (
    <ClientRouterWrapper>
      <div className="site-shell">
        <TopNav />
        <Component {...pageProps} />
        <Footer />
      </div>
    </ClientRouterWrapper>
  )
}
