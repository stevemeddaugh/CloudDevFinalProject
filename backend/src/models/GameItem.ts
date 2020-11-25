export interface GameItem {
  userId: string
  gameId: string
  createdAt: string
  name: string
  publisher: string
  releaseYear: string
  rating: number
  attachmentUrl?: string
}