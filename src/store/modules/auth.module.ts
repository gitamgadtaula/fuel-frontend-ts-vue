import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import AuthService from '@/services/AuthService'

const storedUser = localStorage.getItem('fuelToken')

@Module({ namespaced: true })
class User extends VuexModule {
  public status = storedUser ? { loggedIn: true } : { loggedIn: false }

  @Mutation
  public loginSuccess(user: any): void {
    this.status.loggedIn = true
  }

  @Mutation
  public loginFailure(): void {
    this.status.loggedIn = false
  }

  @Mutation
  public logout(): void {
    this.status.loggedIn = false
  }

  @Mutation
  public registerSuccess(): void {
    this.status.loggedIn = false
  }

  @Mutation
  public registerFailure(): void {
    this.status.loggedIn = false
  }

  @Action({ rawError: true })
  login(data: any): Promise<any> {
    return AuthService.login(data.name, data.email, data.password).then(
      (user) => {
        this.context.commit('loginSuccess', user)
        return Promise.resolve(user)
      },
      (error) => {
        this.context.commit('loginFailure')
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        this.context.commit(
          'setToast',
          { message: message, type: 'red', show: true },
          { root: true }
        )
        return Promise.reject(message)
      }
    )
  }

  @Action({ rawError: true })
  createUser(payload: any): Promise<any> {
    return AuthService.createUser(payload).then(
      (response: any) => {
        if (response.status === 200 || response.status === 201) {
          this.context.commit(
            'setToast',
            {
              message: 'User Registered Successfully',
              type: 'green',
              show: true,
            },
            { root: true }
          )
        } else {
          this.context.commit(
            'setToast',
            { message: response.data.message, type: 'red', show: true },
            { root: true }
          )
        }
        return Promise.resolve(response.data)
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        this.context.commit(
          'setToast',
          { message: message, type: 'red', show: true },
          { root: true }
        )
        return Promise.reject(message)
      }
    )
  }

  @Action
  signOut(): void {
    AuthService.logout()
    this.context.commit('logout')
  }

  get isLoggedIn(): boolean {
    return this.status.loggedIn
  }
}

export default User
