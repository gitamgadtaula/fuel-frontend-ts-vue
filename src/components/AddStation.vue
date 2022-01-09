<template>
    <v-dialog v-model="openModal" max-width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center pt-3">
          <h2 class="black--text">
            Add Fuel Station
          </h2>
          <v-icon @click="closeModal">
            mdi-close
          </v-icon>
        </div>
        <v-divider class="mb-4 mt-4" />
        <ValidationObserver ref="addForm">
            <v-form @submit.prevent="addFuelStation">
                <v-row no-gutters>
                    <v-col cols="12">
                        <ValidationProvider
                            name="Name"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <v-text-field
                                outlined
                                color="primary"
                                dense
                                label="Name"
                                v-model="station.name"
                                :error-messages="errors"
                            ></v-text-field>
                        </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                        <ValidationProvider
                            name="Address"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <v-text-field
                                outlined
                                color="primary"
                                dense
                                label="Address"
                                v-model="station.address"
                                :error-messages="errors"
                            ></v-text-field>
                        </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                        <ValidationProvider
                            name="City"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <v-text-field
                                outlined
                                color="primary"
                                dense
                                label="City"
                                v-model="station.city"
                                :error-messages="errors"
                            ></v-text-field>
                        </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                        <v-row no-gutters v-for="(pump, index) in station.pumps" :key="index" align="center">
                            <v-col cols="6">
                                <v-checkbox hide-details label="Available" v-model="pump.available"></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="text-right pl-2">
                                <v-icon @click="removePump(index)" v-if="station.pumps.length > 1" color="red">mdi-delete</v-icon>
                            </v-col>
                            <v-col cols="6" class="pr-2">
                                <ValidationProvider
                                    name="Fuel Type"
                                    rules="required"
                                    v-slot="{ errors }"
                                >
                                    <v-text-field
                                        outlined
                                        dense
                                        label="Fuel Type"
                                        color="primary"
                                        v-model="pump.fuel_type"
                                        :error-messages="errors"
                                    ></v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col cols="6" class="pl-2">
                                <ValidationProvider
                                    name="Price"
                                    rules="required"
                                    v-slot="{ errors }"
                                >
                                    <v-text-field
                                        outlined
                                        dense
                                        label="Price"
                                        color="primary"
                                        v-model="pump.price"
                                        :error-messages="errors"
                                    ></v-text-field>
                                </ValidationProvider>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-btn depressed outlined color="primary" @click="addPump">Add Pump</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" class="text-right mt-3">
                        <v-btn
                            depressed
                            color="primary"
                            dark
                            class="py-6 px-10"
                            type="submit"
                            :loading="addLoading"
                            block
                        >Save</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator'
import { NewStation, Pump, LatLng, emptyStation } from '@/interfaces/FuelStation'
import { namespace } from "vuex-class";
const StationModule = namespace("Station");
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import { required } from "vee-validate/dist/rules";

@Component({
  components: {
    ValidationObserver,
    ValidationProvider
  }
})
export default class AddStation extends Vue {
    constructor() {
        super();
        extend("required", { ...required, message: "{_field_} is required" });
    }
    $refs!: {
        addForm: InstanceType<typeof ValidationObserver>;
    };
    @Prop({ required: true, default: false }) openModal!: false;
    @Prop({ required: true, default: null }) latLng!: LatLng

    @Emit('closeModal')
    closeModal(): boolean {
      return false
    }

    created(): void {
        this.station = JSON.parse(JSON.stringify(emptyStation()))
        if(this.latLng) {
            this.station.latitude = this.latLng.latitude
            this.station.longitude = this.latLng.longitude
        }
    }

    @Watch('setLatLng', { deep: true })
    stationLatLng(val: LatLng) : void {
        if(val) {
            this.station.latitude = val.latitude
            this.station.longitude = val.longitude
        }
    }

    private addLoading = false

    @StationModule.Action
    private createStation!: (data: NewStation) => Promise<NewStation>;

    private station: NewStation = emptyStation()

    async addFuelStation(): Promise<any> {
        const isValid = await this.$refs.addForm.validate()
        if(isValid) {
            this.addLoading = true
            this.station.latitude = this.latLng.latitude
            this.station.longitude = this.latLng.longitude
            await this.createStation(this.station).then(() => {
                this.closeModal()
                this.addLoading = false
            }).catch(() => {
                this.addLoading = false
            })
        }
    }

    addPump(): void {
        const pump: Pump = {
            fuel_type: '',
            price: 0,
            available: false
        }

        this.station.pumps.push(pump)
    }

    removePump(index: number): void {
        this.station.pumps.splice(index, 1)
    }

}
</script>