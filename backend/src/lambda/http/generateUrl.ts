import 'source-map-support/register'

import { getUserId } from '../utils'
import { getUploadUrl } from '../../businessLogic/games'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const gameId = event.pathParameters.gameId
  const userId = getUserId(event)
  
  const url = await getUploadUrl(gameId, userId)

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Request-Method': 'POST'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}
