import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../utils'
import { UpdateGameRequest } from '../../requests/UpdateGameRequest'
import { updateGame } from '../../businessLogic/games'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const gameId = event.pathParameters.gameId
  const updatedGame: UpdateGameRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  logger.info('Event: ', event)
  logger.info('Updating a game with id: ', gameId)
  const gameItem = await updateGame(updatedGame, userId, gameId)

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: gameItem
    })
  }
}
