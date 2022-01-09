<template>
  <div class="home">
      <v-row align="center" justify="center">
        <v-col cols="12" md="10" lg="10">
          <div class="d-flex align-center justify-space-between">
            <h1 class="mt-4 mb-2">Fuel Stations</h1>
            <v-btn color="red" @click="deleteModal = !deleteModal" dark depressed>Delete All Stations</v-btn>
          </div>
          <p class="mb-5"><i>Click on the map to edit a fuel station and on a marker to edit a fuel station.</i></p>
          
          <GmapMap
            :center="{lat:47.3943939, lng:8.52981}"
            :zoom="7"
            map-type-id="terrain"
            style="width: 100%; height: 500px"
            @click="onMapClick"
          >
            <GmapMarker
              :key="index"
              v-for="(station, index) in stations"
              :position="{ lat: station.latitude, lng: station.longitude }"
              :clickable="true"
              :draggable="true"
              @click="onMarkerClick(station)"
            />
          </GmapMap>
        </v-col>
      </v-row>

      <AddStation
        v-if="addModal && newLatLng"
        :openModal="addModal"
        :latLng="newLatLng"
        @closeModal="addModal = false"
      />

      <EditStation
        v-if="editModal && itemToEdit"
        :openModal="editModal"
        @closeModal="editModal = false"
        :editStation="itemToEdit"
      />

      <v-dialog v-model="deleteModal" max-width="500">
        <v-card>
          <v-card-text>
            <div class="d-flex justify-space-between align-center pt-3">
            <h2 class="black--text">
              Delete All Fuel Station
            </h2>
            <v-icon @click="deleteModal = !deleteModal">
              mdi-close
            </v-icon>
          </div>
          <v-divider class="mb-4 mt-4" />

          <p class="text-center mt-3 mb-4">Are you sure you want to delete all fuel stations.</p>

          <div class="text-center">
            <v-btn color="red" @click="deleteAll" :loading="deleteLoading" dark depressed>Yes, Delete</v-btn>
            <v-btn class="ml-3" @click="deleteModal = !deleteModal" color="primary" outlined>No, Cancel</v-btn>
          </div>
          </v-card-text>
        </v-card>
      </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AddStation from '@/components/AddStation.vue'
import EditStation from '@/components/EditStation.vue'
import FuelStation, { LatLng } from '@/interfaces/FuelStation'
import { namespace } from "vuex-class";
const StationModule = namespace("Station");

@Component({
  components: {
    AddStation,
    EditStation
  }
})
export default class Home extends Vue {
  private addModal = false
  private editModal = false
  private deleteModal = false
  private deleteLoading = false

  private newLatLng: LatLng = {
    latitude: 0,
    longitude: 0
  }
  private itemToEdit!: FuelStation;

  @StationModule.State('stations')
  private stations!: Array<FuelStation>;

  @StationModule.Action
  private fetchFuelStations!: () => Promise<Array<FuelStation>>;

  @StationModule.Action
  private deleteAllStations!: () => Promise<Array<FuelStation>>;

  created(): void {
    this.fetchFuelStations()
  }

  async deleteAll(): Promise<any> {
    this.deleteLoading = true
    this.deleteAllStations().then(() => {
      this.deleteModal = false
      this.deleteLoading = false
    }).catch(() => {
      this.deleteModal = false
      this.deleteLoading = false
    })
  }

  onMapClick(e: any): void {
    this.newLatLng.latitude = e.latLng.lat()
    this.newLatLng.longitude = e.latLng.lng()

    this.addModal = true
  }

  onMarkerClick(station: FuelStation): void {
    this.itemToEdit = Object.assign({}, station)
    this.editModal = true
  }
}
</script>
