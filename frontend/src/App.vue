<template>
  <v-app>
    <v-app-bar color="#0D0D0D" dark flat>
      <v-container class="d-flex align-center justify-space-between">
        <v-toolbar-title class="text-h6">📦 Retira Fácil</v-toolbar-title>
        <nav class="menu-links">
          <RouterLink to="/pacotes" class="menu-link">Pacotes</RouterLink>
          <RouterLink to="/pessoas" class="menu-link">Pessoas</RouterLink>
          <RouterLink to="/lojas" class="menu-link">Lojas</RouterLink>
          <RouterLink to="/configuracao" class="menu-link">Configuração</RouterLink>
        </nav>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.menu-links {
  display: flex;
  gap: 20px;
}

.menu-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: 0.2s;
}

.menu-link:hover {
  color: #90CAF9;
  text-decoration: underline;
}
</style>
