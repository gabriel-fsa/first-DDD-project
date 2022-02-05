import { SignUpController } from './signup'

describe('signup Controller', () => {
  it('should return 400 if name is not provided', async () => {
    const sut = new SignUpController()
    const requestHttp = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new Error('Missing param: name'))
  })

  it('should return 400 if email is not provided', async () => {
    const sut = new SignUpController()
    const requestHttp = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const responseHttp = await sut.handle(requestHttp)
    expect(responseHttp.statusCode).toBe(400)
    expect(responseHttp.body).toEqual(new Error('Missing param: email'))
  })
})
