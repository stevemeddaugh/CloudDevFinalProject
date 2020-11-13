import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { GameItem } from '../models/GameItem'
import { GameUpdate } from '../models/GameUpdate'

const s3 = new AWS.S3({ signatureVersion: 'v4' })

export class GameAccess {
  constructor(

    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3Bucket = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly gamesTable = process.env.GAME_TABLE
  ) {}

  async getAllGames(userId: string): Promise<GameItem[]> {
    const result = await this.docClient.query({
      TableName: this.gamesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      ScanIndexForward: false
    }).promise()

    return result.Items as GameItem[]
  }

  async getGame(gameId: string): Promise<GameItem> {
    const result = await this.docClient.query({
      TableName: this.gamesTable,
      KeyConditionExpression: 'gameId = :gameId',
      ExpressionAttributeValues: { ':gameId': gameId },
      ScanIndexForward: false
    }).promise()

    return result.Items[0] as GameItem
  }

  async createGame(gameItem: GameItem): Promise<GameItem> {
    await this.docClient.put({
      TableName: this.gamesTable,
      Item: gameItem
    }).promise()

    return gameItem
  }

  async deleteGame(gameId: string, userId: string): Promise<string> {
    const params = {
      TableName: this.gamesTable,
      Key: {
        gameId: gameId,
        userId: userId
      }
    }
    const result = await this.docClient.delete(
      params
    ).promise()
    console.log(result)
    return ''
  }

  async updateGame(updatedGame: GameUpdate, userId: string, gameId: string,): Promise<GameItem> { 
    const ret = await this.docClient.update({
      TableName: this.gamesTable,
      Key: {
        gameId: gameId,
        userId: userId
      },
      UpdateExpression: 'SET #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updatedGame.name,
        ':dueDate': updatedGame.dueDate,
        ':done': updatedGame.done
      },
    }).promise()

    return ret.Attributes as GameItem
  }

  async generateUploadUrl(gameId: string, userId: string): Promise<string> {
    await this.addUrlToGame(gameId, userId)
    const url = s3.getSignedUrl('putObject', {
      Bucket: this.s3Bucket,
      Key: gameId,
      Expires: this.urlExpiration
    })
    return url as string
  }

  async addUrlToGame(gameId: string, userId: string) {
    await this.docClient.update({
      TableName: this.gamesTable,
      Key: {
        userId: userId,
        gameId: gameId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${this.s3Bucket}.s3.amazonaws.com/${gameId}`
      }
    }).promise()
  }
}
