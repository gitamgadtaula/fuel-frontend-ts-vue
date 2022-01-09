import axios from 'axios'
import User from '@/interfaces/User'

const API_URL = process.env.VUE_APP_API_BASE

class AuthService {
  login(name: string, email: string, password: string) {
    return axios
      .post(API_URL + 'users/login', {
        name,
        email,
        password,
      })
      .then((response: any) => {
        console.log(response)
        if (response.status === 200) {
          localStorage.setItem('fuelToken', response.data)
        }
        return response
      })
  }

  createUser(payload: User) {
    return axios.post(API_URL + 'users', payload)
  }

  logout() {
    localStorage.removeItem('fuelToken')
  }
}

export default new AuthService()
