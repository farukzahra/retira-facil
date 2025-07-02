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
            <v-col cols="12">
              <v-text-field v-model="form.rastreio" label="Código de Rastreio" required />
            </v-col>

            <v-col cols="12">
              <v-select v-model="form.pessoa_id" :items="pessoas" item-value="id" item-title="nome" label="Pessoa"
                required />
            </v-col>

            <v-col cols="12">
              <v-select v-model="form.loja_id" :items="lojas" item-value="id" item-title="nome" label="Loja" required />
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
      <v-text-field v-model="search" label="Filtrar pacotes" class="mb-4" clearable />
      <v-data-table :headers="headers" :items="pacotes" :search="search" class="elevation-1" item-value="id"> <template
          #item.data_retirada="{ item }">
          <span v-if="item.data_retirada">
            {{ new Date(item.data_retirada).toLocaleString('pt-BR') }}
          </span>
          <span v-else>
            Não retirado
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon variant="text" color="primary" @click="editar(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon variant="text" color="error" @click="confirmarExclusao(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn icon variant="text" color="success" @click="abrirDialogRetirada(item)"
            v-if="!item.data_retirada || item.data_retirada === ''">
            <v-icon>mdi-cash</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

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

    <!-- Dialog de retirada -->
    <v-dialog v-model="dialogRetirada" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Retirar Pacote</v-card-title>
        <v-card-text>
          <div>
            Valor por retirada: <b>R$ {{ valorPorRetirada.toFixed(2) }}</b>
          </div>
          <v-text-field v-model.number="valorPago" label="Valor pago" type="number" min="0" step="0.01" />
          <div v-if="pessoaSelecionada">
            Saldo atual: <b>R$ {{ pessoaSelecionada.saldo?.toFixed(2) ?? '0.00' }}</b>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogRetirada = false">Cancelar</v-btn>
          <v-btn variant="text" color="success" @click="confirmarRetirada">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const pacotes = ref([])
const pessoas = ref([])
const lojas = ref([])

const form = ref({ id: null, rastreio: '', pessoa_id: null, loja_id: null })
const dialogConfirm = ref(false)
const confirmarId = ref(null)
const search = ref('')

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Código de Rastreio', key: 'rastreio', filterable: true },
  { title: 'Pessoa', key: 'pessoa_nome', filterable: true },
  { title: 'Loja', key: 'loja_nome', filterable: true },
  { title: 'Data da Retirada', key: 'data_retirada' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// --- Retirada ---
const dialogRetirada = ref(false)
const valorPorRetirada = ref(1)

const fetchValorPorRetirada = async () => {
  const res = await fetch('http://localhost:3001/api/configuracao/valorPorRetirada')
  const data = await res.json()
  valorPorRetirada.value = Number(data.valor)
}

const valorPago = ref(0)
const pacoteSelecionado = ref(null)
const pessoaSelecionada = computed(() => {
  if (!pacoteSelecionado.value) return null
  return pessoas.value.find(p => p.id === pacoteSelecionado.value.pessoa_id)
})

const abrirDialogRetirada = (item) => {
  pacoteSelecionado.value = item
  valorPago.value = 0
  dialogRetirada.value = true
}

// ...existing code...
const confirmarRetirada = async () => {
  if (!pessoaSelecionada.value) {
    alert('Pessoa não encontrada')
    return
  }
  const saldoAtual = pessoaSelecionada.value.saldo || 0
  const novoSaldo = saldoAtual + (valorPago.value - valorPorRetirada.value)
  await fetch(`http://localhost:3001/api/pessoas/${pessoaSelecionada.value.id}/saldo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ saldo: novoSaldo })
  })
  await fetch(`http://localhost:3001/api/pacotes/${pacoteSelecionado.value.id}/retirar`, {
    method: 'PUT'
  })
  dialogRetirada.value = false
  await fetchPacotes()
  await fetchPessoas()
  alert(`Retirada registrada! Saldo atualizado: R$ ${novoSaldo.toFixed(2)}`)
}

const fetchPacotes = async () => {
  pacotes.value = await (await fetch('http://localhost:3001/api/pacotes')).json()
}

const fetchPessoas = async () => {
  pessoas.value = await (await fetch('http://localhost:3001/api/pessoas')).json()
}

const fetchLojas = async () => {
  lojas.value = await (await fetch('http://localhost:3001/api/lojas')).json()
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

  form.value = { id: null, rastreio: '', pessoa_id: null, loja_id: null }
  fetchPacotes()
}

const editar = (item) => {
  form.value = {
    id: item.id,
    rastreio: item.rastreio,
    pessoa_id: item.pessoa_id,
    loja_id: item.loja_id
  }
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

onMounted(() => {
  fetchPacotes()
  fetchPessoas()
  fetchLojas()
  fetchValorPorRetirada()
})
</script>