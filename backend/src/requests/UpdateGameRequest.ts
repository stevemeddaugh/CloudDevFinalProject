/**
 * Fields in a request to update a single Game item.
 */
export interface UpdateGameRequest {
  name: string
  publisher: string
  releaseYear: string
  rating: number
}