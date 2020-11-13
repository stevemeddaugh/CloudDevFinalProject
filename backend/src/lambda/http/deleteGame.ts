import 'source-map-support/register'

import { deleteGame } from '../../businessLogic/games'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const logger = createLogger('delete')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const gameId = event.pathParameters.gameId

  logger.info('Event: ', event)
  logger.info('Deleting a game with id: ', gameId)
  const userId = getUserId(event)

  await deleteGame(gameId, userId)

  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null
  }
}
