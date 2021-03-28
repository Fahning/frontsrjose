<template>
  <div>
    <q-card style="height: 550px; width: 200vh">
      <q-card-section>
        <div class="text-h6 text-center">Funcionarios</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-table
          :data="listaFuncionarios"
          :columns="columns"
          row-key="name"
          :filter="filter"
          binary-state-sort
          :pagination="initialPagination"
        >
        <template v-slot:top>
          <q-btn color="secondary" @click="novoFuncionario">Novo Funcionario</q-btn>

          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="editaFuncionario(props.row)">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>
               <q-td key="phone" :props="props">
                {{ props.row.phone }}
              </q-td>
               <q-td key="role" :props="props">
                {{ props.row.role }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <NovoFuncionario/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Loading } from 'quasar'
import NovoFuncionario from '../funcionarios/NovoFuncionario'
import barramento from '../../barramento'
export default {
  components: { NovoFuncionario },
  created () {
    barramento.$on('atualizaListaFuncionarios', cliente => {
      const index = this.listaFuncionarios.map(cat => cat.id).indexOf(cliente.id)
      if (index !== -1) {
        this.listaFuncionarios[index].name = cliente.name
        this.listaFuncionarios[index].email = cliente.email
        this.listaFuncionarios[index].phone = cliente.phone
        this.listaFuncionarios[index].role = cliente.role
      } else {
        this.listaFuncionarios.push(cliente)
      }
    })
      barramento.$on('removeListaFuncionarios', cliente => {
      const index = this.listaFuncionarios.map(cat => cat.id).indexOf(cliente.id)
      if (index !== -1) {
        this.listaFuncionarios.splice(index, 1)
      }
    })
  },
    async beforeCreate () {
      Loading.show()
    try {
      const { data } = await this.$axios.get('waiters/all')
      this.listaFuncionarios = data.data
    } catch (e) {
      console.log(e)
    }
    Loading.hide()
  },
  data () {
    return {
      funcionario: {
        phone: null,
        name: null,
        email: null,
        role: null
      },
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        rowsPerPage: 6
      },
      dialog1: false,
      columns: [
        { name: 'name', required: true, label: 'Nome', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true },
        { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
        { name: 'phone', align: 'left', label: 'Telefone', field: 'phone', sortable: true },
        { name: 'role', align: 'left', label: 'Função', field: 'role', sortable: true },
      ],
      listaFuncionarios: [],
      filter: ''
    }
  },
  methods: {
    novoFuncionario(){
      barramento.$emit('editaFuncionario', 'novo')
    },
    editaFuncionario (funcionario) {
      barramento.$emit('editaFuncionario', funcionario)
    },
  }
}
</script>
