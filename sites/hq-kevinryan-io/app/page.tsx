import { redirect } from 'next/navigation'

import { getSession, isAuthDisabled } from '@/lib/auth'
import ChatInterface from './components/ChatInterface'

export default async function HomePage() {
  const session = await getSession()
  if (!session && !isAuthDisabled) redirect('/auth/login')
  return <ChatInterface user={session?.user ?? { name: 'Local Preview', nickname: 'local' }} authDisabled={isAuthDisabled} />
}
