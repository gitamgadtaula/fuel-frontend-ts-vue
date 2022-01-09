import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import FuelStation, { NewStation } from '@/interfaces/FuelStation'
import StationService from '@/services/StationService'
import Vue from 'vue'

@Module({ namespaced: true })
class Station extends VuexModule {
  public stations: Array<FuelStation> = []

  @Mutation
  public setStations(payload: Array<FuelStation>): void {
    this.stations = [...payload]
  }

  @Mutation
  public addStation(payload: FuelStation): void {
    this.stations.push(payload)
  }

  @Mutation
  public removeStation(id: string): void {
    this.stations = this.stations.filter((station) => station.id !== id)
  }

  @Mutation
  public removeAllStation(): void {
    this.stations = []
  }

  @Mutation
  public editStation(payload: FuelStation): void {
    this.stations.find((station: any, index) => {
      if (station.id === payload.id) {
        Vue.set(this.stations, index, payload)
      }
    })
  }

  @Action
  fetchFuelStations(): Promise<Array<FuelStation>> {
    return StationService.getAllStations().then(
      (response: any) => {
        if (response.status === 200 && response.data) {
          this.context.commit('setStations', response.data.message)
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
  createStation(payload: NewStation): Promise<NewStation> {
    return StationService.addStation(payload).then(
      (response: any) => {
        if (response.status === 201 || response.status === 200) {
          this.context.commit('addStation', response.data.message)
          this.context.commit(
            'setToast',
            {
              message: 'Fuel Station Created Successfully.',
              type: 'green',
              show: true,
            },
            { root: true }
          )
        } else {
          this.context.commit(
            'setToast',
            { message: 'Something went wrong', type: 'red', show: true },
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
  updateStation(payload: FuelStation): Promise<FuelStation> {
    return StationService.updateStation(payload).then(
      (response: any) => {
        if (response.status === 200) {
          this.context.commit('editStation', response.data.message)
          this.context.commit(
            'setToast',
            {
              message: 'Fuel Station Updated Successfully.',
              type: 'green',
              show: true,
            },
            { root: true }
          )
        } else {
          this.context.commit(
            'setToast',
            { message: 'Something went wrong.', type: 'red', show: true },
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
  deleteStation(payload: FuelStation): Promise<string> {
    return StationService.deleteStation(payload).then(
      (response: any) => {
        if (response.status === 200) {
          this.context.commit('removeStation', payload.id)
          this.context.commit(
            'setToast',
            {
              message: 'Fuel Station Deleted Successfully.',
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
  deleteAllStations(): Promise<string> {
    return StationService.deleteAllStations().then(
      (response: any) => {
        if (response.status === 200) {
          this.context.commit('removeAllStation')
          this.context.commit(
            'setToast',
            {
              message: 'All Fuel Stations Deleted Successfully.',
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
}

export default Station
