import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title:"Space LEAF Ecosystem", description:"Digital Ship ecosystem core" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
