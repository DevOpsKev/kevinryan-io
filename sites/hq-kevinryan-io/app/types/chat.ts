export interface Segment {
  text: string
  sensitive: boolean
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  segments?: Segment[]
}
