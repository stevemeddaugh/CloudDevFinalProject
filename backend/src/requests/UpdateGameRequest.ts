/**
 * Fields in a request to update a single Game item.
 */
export interface UpdateGameRequest {
  name: string
  dueDate: string
  done: boolean
}