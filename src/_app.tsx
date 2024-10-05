import Head from 'next/head'; // Ensure Head is imported from 'next/head'
import { AppProps } from 'next/app'; // Ensure AppProps is imported from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bowlby+One&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;