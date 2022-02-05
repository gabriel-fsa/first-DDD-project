import { MissingParamError } from '../errors/missing-params-erros'
import { badRequest, ok } from '../helper/http-helper'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  async handle(request:HttpRequest): Promise<HttpResponse> {
    const requiredParams = ['name', 'email']
    // eslint-disable-next-line no-restricted-syntax
    for (const param of requiredParams) {
      if (!request.body[param]) {
        return Promise.resolve(badRequest(new MissingParamError(param)))
      }
    }
    return Promise.resolve(ok('No errors'))
  }
}
