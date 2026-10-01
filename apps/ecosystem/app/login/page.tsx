import { login, signup } from './actions'

export default function LoginPage(){return <main style={{maxWidth:520,margin:'0 auto',padding:40,fontFamily:'system-ui'}}><h1>Space LEAF Sign In</h1><form><label>Email<input name="email" type="email" required style={{display:'block',width:'100%',margin:'8px 0 16px'}}/></label><label>Password<input name="password" type="password" required minLength={8} style={{display:'block',width:'100%',margin:'8px 0 16px'}}/></label><button formAction={login}>Sign in</button>{' '}<button formAction={signup}>Create account</button></form></main>}
