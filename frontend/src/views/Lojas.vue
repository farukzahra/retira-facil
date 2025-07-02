<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-card-title>
        <v-icon class="mr-2">mdi-store</v-icon>
        Cadastro de Lojas
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="salvar">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.nome" label="Nome da Loja" required />
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn type="submit" color="primary">
                {{ form.id ? 'Atualizar' : 'Salvar' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-6" outlined>
      <v-data-table :headers="headers" :items="lojas" class="elevation-1" item-value="id">
        <template #item.actions="{ item }">
          <v-btn icon variant="text" color="primary" @click="editar(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const lojas = ref([])
const form = ref({ id: null, nome: '' })

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const fetchLojas = async () => {
  lojas.value = await (await fetch('http://localhost:3001/api/lojas')).json()
}

const salvar = async () => {
  const method = form.value.id ? 'PUT' : 'POST'
  const url = form.value.id
    ? `http://localhost:3001/api/lojas/${form.value.id}`
    : 'http://localhost:3001/api/lojas'

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })

  form.value = { id: null, nome: '' }
  fetchLojas()
}

const editar = (item) => {
  form.value = { ...item }
}

onMounted(fetchLojas)
</script>