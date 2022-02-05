import { InvalidParamError } from '../errors/invalid-params-erros'
import { MissingParamError } from '../errors/missing-params-erros'
import { badRequest, ok } from '../helper/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(request:HttpRequest): Promise<HttpResponse> {
    const requiredParams = ['name', 'email']
    // eslint-disable-next-line no-restricted-syntax
    for (const param of requiredParams) {
      if (!request.body[param]) {
        return Promise.resolve(badRequest(new MissingParamError(param)))
      }
    }
    const isValid = this.emailValidator.isValid(request.body.email)
    if (!isValid) {
      return Promise.resolve(badRequest(new InvalidParamError('email')))
    }
    return Promise.resolve(ok('No errors'))
  }
}
