import { AccountModel } from '../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../domain/use-cases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string):Boolean { return true }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account:AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      }
      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

interface TypeSut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): TypeSut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub, addAccountStub }
}

describe('signup Controller', () => {
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

  it('should return 400 if password and passwordConfirmation is diferent', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new InvalidParamError('password and passwordConfirmation is diferent'))
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

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError()
    })
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const response = await sut.handle(requestHttp)
    expect(response.body).toEqual(new ServerError())
    expect(response.statusCode).toBe(500)
  })

  it('should calls AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    await sut.handle(requestHttp)
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => Promise.reject(new ServerError()))
    const requestHttp = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const response = await sut.handle(requestHttp)
    expect(response.body).toEqual(new ServerError())
    expect(response.statusCode).toBe(500)
  })

  it('should return 200 valid data is provided', async () => {
    const { sut } = makeSut()
    const requestHttp = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(200)
    expect(responseHttp.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    })
  })
})
