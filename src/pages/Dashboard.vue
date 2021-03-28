<template>
  <q-page class="flex flex-center bg-grey-6 row">
      <q-footer>
       <q-tabs
        v-model="tab"
        class="text-teal bg-white"
      >
        <q-tab name="clients" icon="group_add" label="Clientes" />
        <q-tab name="dashboard" icon="space_dashboard" label="Dashboard" />
        <q-tab name="products" icon="fastfood" label="Produtos" />
        <q-tab name="waiters" icon="engineering" label="Funcionarios" />
        <q-tab name="seles" icon="menu_book" @click="novaVenda" label="Nova Venda" />
      </q-tabs>
      </q-footer>

      <Dashboard v-if="tab == 'dashboard'"/>
      <Clientes v-if="tab == 'clients'" />
      <Products v-if="tab == 'products'" />
      <Funcionario v-if="tab == 'waiters'" />
  </q-page>
</template>

<script>
import Dashboard from '../components/Dashboard'
import Clientes from '../components/clientes/Clientes'
import Products from '../components/produtos/Produtos'
import Funcionario from '../components/funcionarios/Funcionario'
export default {
  components: { Dashboard, Clientes, Products, Funcionario },
  data () {
    return {
      tab: 'dashboard'
    }
  },
  methods: {
    novaVenda(){
      this.$router.push('/atender')
    }
  }
}
</script>
