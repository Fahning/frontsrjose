<template>
  <div>
    <q-card style="height: 550px; width: 200vh">
      <q-card-section>
        <div class="text-h6 text-center">Clientes</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-table
          :data="listaClientes"
          :columns="columns"
          row-key="name"
          :filter="filter"
          binary-state-sort
          :pagination="initialPagination"
        >
        <template v-slot:top>
          <q-btn color="secondary" @click="novoCliente">Novo Cliente</q-btn>

          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="editaCliente(props.row)">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>
               <q-td key="phone" :props="props">
                {{ props.row.phone }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <NovoClient/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Loading } from 'quasar'
import NovoClient from '../clientes/NovoCliente'
import barramento from 'src/barramento'
export default {
  components: { NovoClient },
  created () {
    barramento.$on('atualizaListaClientes', cliente => {
      const index = this.listaClientes.map(cat => cat.id).indexOf(cliente.id)
      if (index !== -1) {
        this.listaClientes[index].name = cliente.name
        this.listaClientes[index].email = cliente.email
        this.listaClientes[index].phone = cliente.phone
      } else {
        this.listaClientes.push(cliente)
      }
    })
      barramento.$on('removeListaClientes', cliente => {
      const index = this.listaClientes.map(cat => cat.id).indexOf(cliente.id)
      if (index !== -1) {
        this.listaClientes.splice(index, 1)
      }
    })
  },
    async beforeCreate () {
      Loading.show()
    try {
      const { data } = await this.$axios.get('clients/all')
      this.listaClientes = data.data
    } catch (e) {
      console.log(e)
    }
    Loading.hide()
  },
  data () {
    return {
      produtos: {},
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        rowsPerPage: 10
      },
      categoria: {
        description: null,
        name: null,
        id: null,
        disabled: false
      },
      dialog1: false,
      columns: [
        { name: 'name', required: true, label: 'Nome', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true },
        { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
        { name: 'phone', align: 'left', label: 'Telefone', field: 'phone', sortable: true },
      ],
      listaClientes: [],
      filter: ''
    }
  },
  methods: {
    novoCliente(){
      barramento.$emit('editaCliente', 'novo')
    },
    editaCliente (cliente) {
      barramento.$emit('editaCliente', cliente)
    },
  }
}
</script>
