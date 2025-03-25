import type React from "react"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Rebane&apos;s Discord Colored Text Generator</title>
        <meta name="description" content="Rebane's Discord Colored Text Generator" />
        <meta name="author" content="rebane2001" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}

