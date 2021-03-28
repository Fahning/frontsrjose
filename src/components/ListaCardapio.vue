<template>
  <q-card class="q-pa-md q-mt-md shadow-7 bg-blue-3 ">
    <q-card-section>
      <div class="text-h6 text-center">Cardápio</div>
    </q-card-section>

    <q-separator inset />

    <q-scroll-area
      style="height: 450px; width: 550px; margin-top: 30px;">
      <div class="row justify-center">
        <q-intersection v-for="produto in produtos" :key="produto.id"  class="col-4 col-sm-2 col-md-2 produtos" @click="quantidade(produto)">
          <q-btn color="primary" :ref="'produto' + produto.id" :label="produto.name" padding="md" class="botoesProd " no-caps push>
            <p class="text-caption precoProd">{{produto.price | capitalize}}</p>
            <p v-show="produto.quantity" >Qnt: {{produto.quantity}}</p>
          </q-btn>
        </q-intersection>
        <q-dialog
            v-model="dialog"
          >
            <q-card style="width: 300px">
              <q-card-section>
                <div class="text-h6">Produto: {{produto.name}}</div>
              </q-card-section>

              <q-card-section class="q-pt-none" >
                <q-input outlined v-model="produto.quantity" mask="###" label="Quantidade"/>
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat @click="selecionar" label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
      </div>
    </q-scroll-area>
    <q-card-actions>
      <q-btn class="full-width" @click="fazerPedido" color="secondary" size="lg">Fazer Pedido</q-btn>
      <FinalizaPedido/>
    </q-card-actions>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import barramento from '../barramento'
import FinalizaPedido from '../components/FinalizaPedido'
export default {
  components: { FinalizaPedido },
  async created () {
    this.loading = true
    try {
      const { data } = await this.$axios.get('products/all')
      this.produtos = data.data
    } catch (error) {
      console.log(error)
    }
    this.loading = false
  },
  data () {
    return {
      loading: false,
      produtos: [],
      produtosSelecionados: [],
      produto: {
        quantity: false
      },
      dialog: false,
      scrollv: false
    }
  },
  methods: {
    quantidade(produto){
      if(this.$refs['produto'+produto.id][0].$el.classList[7] === 'bg-primary'){
        this.produto = produto
        this.dialog = true
      }else{
        this.produto = produto
        this.selecionar()
      }
    },
    selecionar(){
      if(this.produtosSelecionados.filter(item => item.id === this.produto.id).length <= 0) {
        this.$refs['produto'+this.produto.id][0].$el.classList.replace('bg-primary','bg-secondary')
        this.produtosSelecionados.push(this.produto)
      }else {
        this.produto.quantity = 0
        this.$refs['produto'+this.produto.id][0].$el.classList.replace('bg-secondary','bg-primary')
        this.produtosSelecionados.splice(this.produtosSelecionados.indexOf(this.produto), 1)
      }
    },
    async fazerPedido(){
      const pedido = {
        client_id: localStorage.getItem('cliente_id'),
        waiter: JSON.parse(localStorage.getItem('waiter')).value,
        products: this.produtosSelecionados
      }
      barramento.$emit('finalizaPedido', pedido)
    }
  }
}
</script>

<style >
.botoesProd {
  height: 100px;
  width: 100px;
}

.precoProd {
  flex-basis: 100%;
  height: 0;
}

.produtos {
  margin-inline: 10px;
  margin-top: 10px;
}

.q-scrollarea__bar--v, .q-scrollarea__thumb--v {
    width: 0px;
    margin: 0;
    padding: 0;
}
</style>
