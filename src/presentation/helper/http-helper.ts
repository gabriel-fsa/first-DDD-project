import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const ok = (msgBody: string): HttpResponse => ({
  statusCode: 200,
  body: msgBody,
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (): HttpResponse => ({
  statusCode: 500, body: new ServerError(),
})
