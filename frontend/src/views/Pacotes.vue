<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-card-title>
        <v-icon class="mr-2">mdi-package-variant</v-icon>
        Lista de Pacotes
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="salvar">
          <v-row>
            <v-col cols="12" md="5">
              <v-text-field v-model="form.nome" label="Nome" required />
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field v-model="form.rastreio" label="Código de Rastreio" required />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn type="submit" color="primary" block>
                {{ form.id ? 'Atualizar' : 'Salvar' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-6" outlined>
      <v-data-table :headers="headers" :items="pacotes" class="elevation-1" item-value="id">
        <template #item.actions="{ item }">
          <v-btn icon variant="text" color="primary" @click="editar(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon variant="text" color="error" @click="confirmarExclusao(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de confirmação -->
    <v-dialog v-model="dialogConfirm" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir este pacote?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogConfirm = false">Não</v-btn>
          <v-btn variant="text" color="error" @click="deletar(confirmarId)">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pacotes = ref([])
const form = ref({ id: null, nome: '', rastreio: '' })
const dialogConfirm = ref(false)
const confirmarId = ref(null)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'Rastreio', key: 'rastreio' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const fetchPacotes = async () => {
  pacotes.value = await (await fetch('http://localhost:3001/api/pacotes')).json()
}

const salvar = async () => {
  const method = form.value.id ? 'PUT' : 'POST'
  const url = form.value.id
    ? `http://localhost:3001/api/pacotes/${form.value.id}`
    : 'http://localhost:3001/api/pacotes'

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })

  form.value = { id: null, nome: '', rastreio: '' }
  fetchPacotes()
}

const editar = (item) => {
  form.value = { ...item }
}

const confirmarExclusao = (id) => {
  confirmarId.value = id
  dialogConfirm.value = true
}

const deletar = async (id) => {
  dialogConfirm.value = false
  await fetch(`http://localhost:3001/api/pacotes/${id}`, { method: 'DELETE' })
  fetchPacotes()
}

onMounted(fetchPacotes)
</script>
