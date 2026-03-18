import { redirect } from 'next/navigation'

import { auth0 } from '../lib/auth0'
import ChatInterface from './components/ChatInterface'

export default async function HomePage() {
  const session = await auth0.getSession()
  if (!session) redirect('/auth/login')
  return <ChatInterface user={session.user} />
}
