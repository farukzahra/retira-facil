<template>
  <v-app>
    <!-- App Bar fixa -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>📦 Retira Fácil</v-toolbar-title>
      <v-spacer />
      <v-btn to="/pacotes" variant="text" color="white">Pacotes</v-btn>
      <v-btn to="/pessoas" variant="text" color="white">Pessoas</v-btn>
    </v-app-bar>

    <!-- Conteúdo da página -->
    <v-main>
      <v-container class="py-8">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
