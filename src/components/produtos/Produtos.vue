<template>
  <div>
    <q-card style="height: 550px; width: 200vh">
      <q-card-section>
        <div class="text-h6 text-center">Produtos</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <q-table
          :data="listaProdutos"
          :columns="columns"
          row-key="name"
          :filter="filter"
          binary-state-sort
          :pagination="initialPagination"
        >
        <template v-slot:top>
          <q-btn color="secondary" @click="novoProduto">Novo Produto</q-btn>

          <q-space />
          <q-input dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="editaProduto(props.row)">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="price" :props="props">
                {{ props.row.price }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <NovoProduto/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Loading } from 'quasar'
import NovoProduto from '../produtos/NovoProduto'
import barramento from 'src/barramento'
export default {
  components: { NovoProduto },
  created () {
    barramento.$on('atualizaListaProdutos', produto => {
      const index = this.listaProdutos.map(cat => cat.id).indexOf(produto.id)
      if (index !== -1) {
        this.listaProdutos[index].name = produto.name
        this.listaProdutos[index].price = produto.price
      } else {
        this.listaProdutos.push(produto)
      }
    })
      barramento.$on('removeListaProdutos', produto => {
      const index = this.listaProdutos.map(cat => cat.id).indexOf(produto.id)
      if (index !== -1) {
        this.listaProdutos.splice(index, 1)
      }
    })
  },
    async beforeCreate () {
      Loading.show()
    try {
      const { data } = await this.$axios.get('products/all')
      this.listaProdutos = data.data
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
        rowsPerPage: 6
      },
      dialog1: false,
      columns: [
        { name: 'name', required: true, label: 'Nome', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true },
        { name: 'price', align: 'left', label: 'Preço', field: 'price', sortable: true }
      ],
      listaProdutos: [],
      filter: ''
    }
  },
  methods: {
    novoProduto(){
      barramento.$emit('editaProduto', 'novo')
    },
    editaProduto (cliente) {
      barramento.$emit('editaProduto', cliente)
    },
  }
}
</script>
