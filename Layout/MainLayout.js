import React from 'react'
import Head from 'next/head'
import { Header } from '../Components/Header'
import { Footer } from '../Components/Footer'

export const MainLayout = ({ children, title = 'App', description = undefined, active = null }) => {
    return (
        <div className="wrapper">
            <Head>
                <title>{title} | Shop-Book</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={description} />
            </Head>
            <Header active={active} />
            <div className="container">{children}</div>
            <Footer />
        </div>
    )
}
