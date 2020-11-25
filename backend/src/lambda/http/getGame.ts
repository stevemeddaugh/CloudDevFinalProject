import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'
import { getSingleGame } from '../../businessLogic/games'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const gameId = event.pathParameters.gameId

  logger.info('Event: ', event)
  logger.info('Getting a single game for editing... gameID: ', gameId, ' userID: ', userId)
  const item = await getSingleGame(gameId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: item
    })
  }
}
