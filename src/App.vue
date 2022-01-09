<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h2>Fuel Stations</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="$route.path === '/'"
        text
        @click="logoutUser"
      >
        <v-icon>mdi-power</v-icon>
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-snackbar
      v-if="alert"
      v-model="alert.show"
      :color="alert.type"
      top
      right
    >
      {{ alert.message }}
    </v-snackbar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from "vuex-class";
import { namespace } from "vuex-class";
const AuthModule = namespace("Auth");

@Component({})
export default class App extends Vue {
  @Getter('getToast') alert!: any
  // json-server --watch db.json

  @AuthModule.Action
    private signOut!: () => void;

    logoutUser() : void {
      this.signOut();
      this.$router.push('/login')
    }
}
</script>
