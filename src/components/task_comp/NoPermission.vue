<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout wrap style="position: relative;">
        <!-- <img src="@/assets/images/logo-enterprise-2.0.png" alt="Vuetify.js" class="mb-5"> -->
        <v-btn outline @click="$router.go(-2)" color="primary" small class="ma-0">
          <v-icon left>reply</v-icon>
          Quay lại
        </v-btn>
        <div style="position: absolute;width: 100%;text-align: center;z-index: -1">
          <img src="/o/mobilink-theme/images/403-Error.png" alt="Vuetify.js" class="mb-5 align-center">
        </div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
