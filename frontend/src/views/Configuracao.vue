<template>
  <v-container>
    <v-card>
      <v-card-title>Configuração</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="salvar">
          <v-text-field
            v-model.number="valorPorRetirada"
            label="Valor por Retirada"
            type="number"
            min="0"
            step="0.01"
            required
          />
          <v-btn type="submit" color="primary">Salvar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const valorPorRetirada = ref(1)

const fetchValor = async () => {
  const res = await fetch('http://localhost:3001/api/configuracao/valorPorRetirada')
  const data = await res.json()
  valorPorRetirada.value = Number(data.valor)
}

const salvar = async () => {
  await fetch('http://localhost:3001/api/configuracao/valorPorRetirada', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor: valorPorRetirada.value })
  })
}

onMounted(fetchValor)
</script>