<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-card-title>
        <v-icon class="mr-2">mdi-account</v-icon>
        Cadastro de Pessoas
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="salvar">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.nome" label="Nome completo" required />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.cpf"
                label="CPF"
                required
                @input="form.cpf = aplicarMascaraCPF(form.cpf)"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model.number="form.saldo"
                label="Saldo"
                prefix="R$"
                type="number"
                min="0"
                step="0.01"
                required
              />
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
      <v-data-table :headers="headers" :items="pessoas" class="elevation-1" item-value="id">
        <template #item.saldo="{ item }">
          R$ {{ (item.saldo ?? 0).toFixed(2) }}
        </template>
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
import { aplicarMascaraCPF } from '../utils/mask.js'

const pessoas = ref([])
const form = ref({ id: null, nome: '', cpf: '', saldo: 0 })

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Nome', key: 'nome' },
    { title: 'CPF', key: 'cpf' },
    { title: 'Saldo', key: 'saldo' },
    { title: 'Ações', key: 'actions', sortable: false }
]

const fetchPessoas = async () => {
    pessoas.value = await (await fetch('http://localhost:3001/api/pessoas')).json()
}

const salvar = async () => {
    const method = form.value.id ? 'PUT' : 'POST'
    const url = form.value.id
        ? `http://localhost:3001/api/pessoas/${form.value.id}`
        : 'http://localhost:3001/api/pessoas'

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
    })

    if (!response.ok) {
        const result = await response.json()
        alert(result.error || 'Erro ao salvar')
        return
    }

    form.value = { id: null, nome: '', cpf: '', saldo: 0 }
    fetchPessoas()
}

const editar = (p) => {
    form.value = { ...p }
    if (form.value.saldo == null) form.value.saldo = 0
}

onMounted(fetchPessoas)
</script>