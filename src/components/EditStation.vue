<template>
    <v-dialog v-model="openModal" max-width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center pt-3">
          <h2 class="black--text">
            Edit Fuel Station
          </h2>
          <v-icon @click="closeModal">
            mdi-close
          </v-icon>
        </div>
        <v-divider class="mb-4 mt-4" />
        <ValidationObserver ref="editForm">
            <v-form @submit.prevent="editFuelStation">
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
                            <v-col cols="6" class="mb-1">
                                <v-checkbox hide-details label="Available" v-model="pump.available"></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="text-right pl-2 mb-1">
                                <v-icon @click="removePump(index)" v-if="stationPumps.length > 1" color="red">mdi-delete</v-icon>
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
                    
                    <v-col cols="6" class="mt-5 pr-2">
                        <v-btn
                            depressed
                            color="primary"
                            dark
                            type="submit"
                            block
                            :loading="editLoading"
                        >Save</v-btn>
                    </v-col>
                    <v-col cols="6" class="mt-5 pl-2">
                        <v-btn
                            depressed
                            color="red"
                            dark
                            block
                            @click="removeStation"
                            :loading="deleteLoading"
                        >Delete</v-btn>
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
import FuelStation, {Pump } from '@/interfaces/FuelStation'
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
export default class EditStation extends Vue {
    constructor() {
        super();
        extend("required", { ...required, message: "{_field_} is required" });
    }
    $refs!: {
        editForm: InstanceType<typeof ValidationObserver>;
    };
    @Prop({ required: true, default: false }) openModal!: false;
    @Prop({ required: true }) editStation!: FuelStation;
    private station: FuelStation = {
        name: '',
        address: '',
        city: '',
        latitude: 0,
        longitude: 0,
        pumps: [
            {
                fuel_type: '',
                price: 0,
                available: false
            }
        ]
    };

    private editLoading = false
    private deleteLoading = false

    @StationModule.Action
    private updateStation!: (data: FuelStation) => Promise<FuelStation>;

    @StationModule.Action
    private deleteStation!: (id: FuelStation) => Promise<string>;

    @Emit('closeModal')
    closeModal(): boolean {
      return false
    }

    @Watch('editStation', { deep: true })
    setStation(val: FuelStation): void {
        if (val) {
            this.station = JSON.parse(JSON.stringify(val))
        }
    }

    created (): void {
        if(this.editStation) {
            this.station = JSON.parse(JSON.stringify(this.editStation))
        }
    }

    async editFuelStation(): Promise<any> {
        const isValid = await this.$refs.editForm.validate()
        if(isValid) {
            this.editLoading = true
            await this.updateStation(this.station).then(() => {
                this.closeModal()
            })
            this.editLoading = false
        }
    }

    async removeStation(): Promise<any> {
        this.deleteLoading = true
        await this.deleteStation(this.editStation).then(() => {
            this.closeModal()
            this.deleteLoading = false
        }).catch(() => {
            this.deleteLoading = false
        })
    }

    get stationPumps(): Array<Pump> {
        return this.station.pumps
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
        console.log('Remove ', this.station.pumps[index])
        this.station.pumps.splice(index, 1)
    }
}
</script>