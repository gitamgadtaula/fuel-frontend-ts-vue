import FuelStation, { NewStation } from '@/interfaces/FuelStation'
import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'https://asbackend.robertrichter.dev/api/v2/' // TODO: Move to .env
class StationService {
  addStation(payload: NewStation) {
    return axios.post(`${API_URL}fuelstations`, payload, {
      headers: authHeader(),
    })
  }

  getAllStations() {
    return axios.get(`${API_URL}fuelstations`, { headers: authHeader() })
  }

  updateStation(payload: FuelStation) {
    return axios.put(API_URL + 'fuelstations/' + payload.id, payload, {
      headers: authHeader(),
    })
  }

  deleteStation(payload: FuelStation) {
    return axios.delete(API_URL + 'fuelstations/' + payload.id, {
      headers: authHeader(),
    })
  }

  deleteAllStations() {
    return axios.delete(API_URL + 'fuelstations/', { headers: authHeader() })
  }
}

export default new StationService()
