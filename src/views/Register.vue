<template>
    <div class="login">
        <v-form>
            <v-row align="center" justify="center" class="mt-10">
                <v-col cols="12" md="6" lg="4">
                    <v-card class="text-center">
                        <v-card-text>
                            <div class=" pt-3">
                                <h2 class="black--text text-left">
                                    Register
                                </h2>
                            </div>
                            <v-divider class="mb-4 mt-4" />
                            <v-row>
                               <v-col cols="12">
                                   <v-text-field
                                    v-model="user.name"
                                    label="Name"
                                    outlined
                                    color="primary"
                                   ></v-text-field>
                                   <v-text-field
                                    v-model="user.email"
                                    label="Email"
                                    type="email"
                                    outlined
                                    color="primary"
                                   ></v-text-field>
                                   <v-text-field
                                    v-model="user.password"
                                    type="password"
                                    label="Password"
                                    outlined
                                    color="primary"
                                   ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn
                                        depressed
                                        color="primary"
                                        block
                                        class="py-6 mb-2"
                                        :disabled="!user.name || !user.password || !user.email"
                                        @click="register"
                                        :loading="loading"
                                    >
                                        Register
                                    </v-btn>
                                    <router-link to="/login">Already have an account? Login</router-link>
                                </v-col> 
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import User from '@/interfaces/User'
import { namespace } from "vuex-class";
const AuthModule = namespace("Auth");

@Component({})
export default class Login extends Vue {

    private user: User = {
        name: '',
        email: '',
        password: ''
    }

    private loading = false

    @AuthModule.Action
    private createUser!: (user: User) => Promise<Array<User>>;

    @AuthModule.Getter
    private isLoggedIn!: boolean;

    async register(): Promise<any> {
        this.loading = true
        await this.createUser(this.user).then(() => {
            this.loading = false
            this.$router.push('/login')
        }).catch(() => {
            this.loading = false
        })
    }

    created (): void {
      if (this.isLoggedIn) {
        this.$router.push('/')
      }
    }
}
</script>