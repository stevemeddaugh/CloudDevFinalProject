/**
 * Fields in a request to create a single Game item.
 */
export interface CreateGameRequest {
  name: string
  publisher: string
  releaseYear: string
  rating: number
}
