import { MissingParamError } from '../errors/missing-params-erros'
import { SignUpController } from './signup'

interface TypeSut {
  sut: SignUpController
}

const makeSut = (): TypeSut => {
  const sut = new SignUpController()

  return { sut }
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
})
