import { InvalidParamError } from '../errors/invalid-params-erros'
import { MissingParamError } from '../errors/missing-params-erros'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface TypeSut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): TypeSut => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string):Boolean { return true }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return { sut, emailValidatorStub }
}

describe('signup Controller', () => {
  it('should return 200 all data is provided', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(200)
  })

  it('should return 400 if name is not provided', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if passwordConfirmation is not provided', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with email received', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    await sut.handle(requestHttp)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
