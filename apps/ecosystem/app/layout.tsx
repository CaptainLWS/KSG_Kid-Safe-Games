import type { Metadata } from 'next'
export const metadata: Metadata={title:'Space LEAF Ecosystem',description:'Phase 1 ecosystem vertical slice'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
