export default interface FuelStation {
  id?: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  pumps: Pump[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Pump {
  id?: number
  fuel_type: string
  price: number
  available: boolean
}

export interface NewStation {
  name: string | null
  address: string
  city: string
  latitude?: number
  longitude?: number
  pumps: Pump[]
}

export interface LatLng {
  latitude?: number
  longitude?: number
}

export function emptyStation(): NewStation {
  return {
    name: null,
    address: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    pumps: [],
  }
}

export function emptyPump(): Pump {
  return {
    fuel_type: '',
    price: 0,
    available: false,
  }
}
