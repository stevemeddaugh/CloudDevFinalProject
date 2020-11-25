export interface Game {
  gameId: string,
  createdAt: string,
  name: string,
  publisher: string,
  releaseYear: string,
  rating: number,
  attachmentUrl?: string
}
