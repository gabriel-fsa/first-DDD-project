import { InvalidParamError } from '../errors/invalid-params-erros'
import { MissingParamError } from '../errors/missing-params-erros'
import { ServerError } from '../errors/server-error'
import { badRequest, ok, serverError } from '../helper/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(request:HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ['name', 'email', 'password', 'passwordConfirmation']
      // eslint-disable-next-line no-restricted-syntax
      for (const param of requiredParams) {
        if (!request.body[param]) {
          return Promise.resolve(badRequest(new MissingParamError(param)))
        }
      }
      const { password, passwordConfirmation } = request.body
      const isPasswordsDifferents = password !== passwordConfirmation
      if (isPasswordsDifferents) {
        return Promise.resolve(badRequest(new InvalidParamError('password and passwordConfirmation is diferent')))
      }
      const isValid = this.emailValidator.isValid(request.body.email)
      if (!isValid) {
        return Promise.resolve(badRequest(new InvalidParamError('email')))
      }
      return await Promise.resolve(ok('No errors'))
    } catch (err) {
      return Promise.resolve(serverError())
    }
  }
}
