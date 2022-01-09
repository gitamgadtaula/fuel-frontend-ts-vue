import axios from 'axios'
import User from '@/interfaces/User'

const API_URL = 'https://asbackend.robertrichter.dev/api/v2/'

class AuthService {
  async login(name: string, email: string, password: string) {
    const response = await axios.post(API_URL + 'users/login', {
      name,
      email,
      password,
    })
    console.log(response)
    if (response.status === 200) {
      localStorage.setItem('fuelToken', response.data)
    }
    return response
  }

  createUser(payload: User) {
    return axios.post(API_URL + 'users', payload)
  }

  logout() {
    localStorage.removeItem('fuelToken')
  }
}

export default new AuthService()
