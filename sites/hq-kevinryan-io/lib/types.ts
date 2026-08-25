export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface User {
  picture?: string
  nickname?: string
  name?: string
}
