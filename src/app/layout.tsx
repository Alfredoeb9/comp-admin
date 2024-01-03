"use client"

import './globals.css'
import Header from './components/Header'
import Provider from './components/providers/SessionProvider'
import { NextUIProvider } from '@nextui-org/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <Provider>
            <Header />
            {children}
          </Provider>
        </NextUIProvider>
      </body>
    </html>
  )
}
