import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateGameRequest } from '../../requests/CreateGameRequest'
import { createGame } from '../../businessLogic/games'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newGame: CreateGameRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  logger.info('Event: ', event)
  logger.info('Creating a game for user: ', userId)
  const newItem = await createGame(newGame, userId)

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
