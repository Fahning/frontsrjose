<template>
  <div>
    <q-card flat bordered style="width: 500px;">
      <q-card-section>
        <div class="text-h6 text-center">Iniciar Pedido</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section style="padding-bottom: 0;">
        <q-select class="q-my-sm" outlined v-model="funcionario" :options="options" label="Funcionario" />
      </q-card-section>
      <!--Busca por cliente cadastrado-->
      <q-card-section style="padding-top: 0;">
          <q-select
            outlined
            v-model="BuscaClient"
            use-input
            :options="filterOptions"
            :loading="loadingState"
            @filter="buscaCliente"
            :hint="msgClient"
            label="Cliente"
          />
          <q-btn v-show="BuscaClient" @click="fazerPedido" class="full-width" color="secondary" label="Fazer Pedido" />
      </q-card-section>
      <!--Busca por cliente cadastrado-->

      <q-separator inset />

      <!--Exibe form para cadastrar cliente case não esteja cadastrado-->
      <div class="row justify-center" v-show="naoCadastrado">
        <q-card flat bordered class="bg-blue-1 q-my-lg" style="width: 470px;">
          <q-card-section>
            <div class="text-bold text-center">Novo Cliente</div>
          </q-card-section>

          <q-separator inset />
          <q-card-section>
            <q-input bottom-slots outlined v-model="cliente.name" label="Nome" placeholder="Nome do Cliente..." />
            <q-input bottom-slots type="email" outlined v-model="cliente.email" label="email" placeholder="Email do Cliente..." />
            <q-input bottom-slots mask="(##) # ####-####" outlined v-model="cliente.phone" label="Telefone" placeholder="Telefone do Cliente..." />
          </q-card-section>
          <q-card-section style="padding-top: 0;">
            <q-btn @click="cadastraCliente" color="secondary" class="full-width">Cadastrar</q-btn>
          </q-card-section>
        </q-card>
      </div>
      <!--Exibe form para cadastrar cliente case não esteja cadastrado-->
    </q-card>
  </div>
</template>

<script>
export default {
  async beforeCreate(){
    try {
      const { data } = await this.$axios.get('waiters/all')
      data.data.map(item => {
        let option = {
          label: item.name,
          value: item.id
        }
        this.options.push(option)
      })
        console.log(this.options)
    } catch (error) {

    }
  },
  data () {
    return {
      BuscaClient: null,
      naoCadastrado: false,
      loadingState: false,
      msgClient: '',
      filterOptions: [],
      funcionario: JSON.parse(localStorage.getItem('waiter')) ?? null,
      options: [],
      cliente: {
        name: null,
        email: null,
        phone: null
      }
    }
  },
  methods: {
    buscaCliente (val, update) {
      update(async () => {
        if(val != ''){
          this.loadingState = true
          try {
            const { data } = await this.$axios.get('clients/findPhone/' + val.toString())
            if(data.data.length > 0 ) {
              this.msgClient = ''
              this.naoCadastrado= false
              data.data.map(i => {
                const option = {label:i.name, value: i.id}
                const retorno = this.filterOptions.filter(option => option.value === i.id)
                if(retorno.length <= 0){
                  this.filterOptions.push(option)
                }
              })
            }else {
              this.msgClient = 'Cliente não Cadastrado'
              this.filterOptions = []
              this.naoCadastrado= true

            }
          } catch (error) {
            console.log(error)
          }
          this.loadingState = false
        }
      })
    },
    async cadastraCliente() {
      try {
        const { data } = await this.$axios.post('clients/new', this.cliente)
        localStorage.setItem('cliente_id', data.data.id)
        this.$router.push('/cardapio')
        this.$q.notify({
          message: `Cliente ${data.data.name} cadastrado com suceeso`,
          color: 'green'
        })
      } catch (error) {
        this.$q.notify({
          message: `Falha ao cadastrar Cliente: ${data.data.name}`,
          color: 'red'
        })
      }
    },
    fazerPedido(){
      localStorage.setItem('cliente_id', this.BuscaClient.value)
      localStorage.setItem('waiter', JSON.stringify(this.funcionario))
      this.$router.push('/cardapio')
    }
  }

}
</script>
