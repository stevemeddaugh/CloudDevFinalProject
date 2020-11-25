import * as uuid from 'uuid'

import { GameItem } from '../models/GameItem'
import { GameUpdate } from '../models/GameUpdate'
import { GameAccess } from '../dataLayer/gameAccess'
import { CreateGameRequest } from '../requests/CreateGameRequest'

const gameAccess = new GameAccess()

export async function getAllGames(currentUserId: string,): Promise<GameItem[]> {
  return gameAccess.getAllGames(currentUserId)
}

export async function getSingleGame(gameId: string, userId: string): Promise<GameItem> {
  return gameAccess.getGame(gameId, userId)
}

export async function createGame(
  createGameRequest: CreateGameRequest,
  currentUserId: string
): Promise<GameItem> {

  const gameId = uuid.v4()

  return await gameAccess.createGame({
    userId: currentUserId,
    gameId,
    createdAt: new Date().toISOString(),
    name: createGameRequest.name,
    publisher: createGameRequest.publisher,
    releaseYear: createGameRequest.releaseYear,
    rating: createGameRequest.rating,
    attachmentUrl: null
  })
}

export async function updateGame(
    updates: GameUpdate,
    currentUserId: string,
    gameId: string,
): Promise<any> {
    return await gameAccess.updateGame(updates, currentUserId, gameId)
}

export async function deleteGame(
    gameId: string,
    currentUserId: string
): Promise<any> {
    return gameAccess.deleteGame(gameId, currentUserId)
}

export async function getUploadUrl(gameId: string, userId: string): Promise<string> {
    return await gameAccess.generateUrl(gameId, userId)
}
  