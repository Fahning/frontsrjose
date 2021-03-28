<template>
  <div>
    <q-dialog
      v-model="dialog"
    >
      <q-card style="width: 580px; max-width: 80vw;">
        <q-card-section style="max-height: 50vh">
          <div class="text-h6 text-center">Finalizar Pedido</div>
        </q-card-section>
        <q-separator/>

        <q-card-section class="q-pt-lg">
          <q-input class="q-my-sm" prefix="R$: " outlined v-model="pedido.total" disable label="Total" />
          <q-input class="q-my-sm" prefix="R$: " mask="#.##" fill-mask="0" reverse-fill-mask outlined v-model="pedido.discount" label="Disconto" />
          <q-input class="q-my-sm" prefix="R$: " mask="#.##" fill-mask="0" reverse-fill-mask outlined v-model="pedido.commission" label="Serviço" />
          <q-input class="q-my-sm" outlined v-model="pedido.commands" label="Mesa" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal q-px-sm">
          <q-btn class="full-width" @click="fazerPedido" size="lg" label="Finalizar" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import barramento from '../barramento'
import { Loading } from 'quasar'
export default {
  beforeCreate(){
    barramento.$on('finalizaPedido', pedido => {
      this.pedido = pedido
      let total = 0
      pedido.products.map(e => {
        total = total + e.quantity * e.price
      })
      this.pedido.total = total.toFixed(2)
      this.dialog = true
    })
  },
  data () {
    return {
      dialog: false,
      pedido: {
        total: 0,
        discount: 0,
        commission: 0,
        commands: 0,
      }
    }
  },
  methods: {
    async fazerPedido(){
      Loading.show()
      try {
        await this.$axios.post('orders/makeOrder', this.pedido)
        this.$router.push('/atender')
        this.$q.notify({
          message: `Pedido efetuado com sucesso`,
          color: 'green'
        })
      } catch (error) {
        this.$q.notify({
          message: 'Falha ao efetuar pedido',
          color: 'red'
        })
      }
      Loading.hide()
    }
  }
}
</script>
