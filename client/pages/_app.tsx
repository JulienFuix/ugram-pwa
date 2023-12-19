import React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head';

import "../styles/index.css";
import AuthWrapper from "../src/context/AuthContext";
import UserWrapper from "../src/context/UserContext";
import { ToastContainer } from "react-toastify";
import PublicationWrapper from "../src/context/PublicationContext";
import ChatWrapper from "../src/context/ChatContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <ThemeProvider enableSystem={true}>
                <Head>
                    <title>Ugram</title>
                    <link rel="icon" href="/Ugram-Favicon-32x32.ico" />
                </Head>
                <ToastContainer />
                <AuthWrapper>
                    <UserWrapper>
                        <ChatWrapper>
                            <PublicationWrapper>
                                <Component {...pageProps} />
                            </PublicationWrapper>
                        </ChatWrapper>
                    </UserWrapper>
                </AuthWrapper>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
