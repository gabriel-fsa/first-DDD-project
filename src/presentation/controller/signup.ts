import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, ok, serverError } from '../helper'
import {
  Controller, EmailValidator, HttpRequest, HttpResponse,
} from '../protocols'

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
      const { email, password, passwordConfirmation } = request.body
      const isPasswordsDifferents = password !== passwordConfirmation
      if (isPasswordsDifferents) {
        return Promise.resolve(badRequest(new InvalidParamError('password and passwordConfirmation is diferent')))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return Promise.resolve(badRequest(new InvalidParamError('email')))
      }
      return await Promise.resolve(ok('No errors'))
    } catch (err) {
      return Promise.resolve(serverError())
    }
  }
}
