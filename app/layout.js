import './globals.css'

export const metadata = {
  title: 'STK PVT LTD - Professional Background Removal',
  description: 'Remove backgrounds from images with AI and composite onto beautiful custom scenes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
