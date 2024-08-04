import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import {CardContextProvider} from '../../components/CardContext';
import {SessionProvider} from "next-auth/react";
const GlobalStyles = createGlobalStyle`
    body {
        background-color: #f1f1f1;
        padding: 0;
        margin: 0;
        font-family: 'Roboto', sans-serif;
        
    }
    hr{
        display: block;
        border: 0;
        border-top: 1px solid #eee;
    }
`;

export default function App({ Component, pageProps: {session, ...pageProps} }) {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/stylesheet.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
            </Head>
            <GlobalStyles />
            <CardContextProvider>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </CardContextProvider>
        </>
    );
}
