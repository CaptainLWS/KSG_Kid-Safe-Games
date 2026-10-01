import Link from 'next/link'

export default function Home() {
  return <main style={{maxWidth:960,margin:'0 auto',padding:40,fontFamily:'system-ui'}}><h1>Space LEAF Ecosystem</h1><p>Phase 1 vertical slice: authenticated identity, Digital Ship, Jarvondis continuity, safety, events, and recoverable state.</p><p><Link href="/login">Enter the ecosystem</Link></p></main>
}
