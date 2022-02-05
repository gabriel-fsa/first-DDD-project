import { MissingParamError } from '../errors/missing-params-erros'
import { badRequest } from '../helper/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  async handle(request:HttpRequest): Promise<HttpResponse> {
    const requiredParams = ['name', 'email']
    // eslint-disable-next-line no-restricted-syntax
    for (const param of requiredParams) {
      if (!request.body[param]) {
        return Promise.resolve(badRequest(new MissingParamError(param)))
      }
    }
    return Promise.resolve({
      statusCode: 200,
      body: 'No errors',
    })
  }
}
