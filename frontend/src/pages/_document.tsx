import { Html, Head, Main, NextScript } from 'next/document';

// ======================== DOCUMENT COMPONENT ========================

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta tags globais */}
        <meta charSet="utf-8" />
        <meta name="author" content="GW Sistemas" />
        <meta name="theme-color" content="#0099ff" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* Fonte Lato do Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
