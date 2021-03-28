<template>
  <div class="row">
    <q-card style="height: 550px; width: 200vh">
      <q-card-section>
        <div class="text-h6 text-center">Dashboard</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
          <div class="row justify-between">
            <div class="col-4 q-px-lg">
              <q-card>
                <q-card-section class="bg-grey-6 text-white">
                  <div class="text-subtitle2 text-center">Vendas do dia</div>
                  <div class="text-subtitle1 text-light-green-13">Total: {{ vendasDia.total_price | capitalize }}</div>
                  <div class="text-subtitle2 text-light-green-2">Vendas: {{ vendasDia.total_qnt }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-4 q-px-lg">
              <q-card>
                <q-card-section class="bg-grey-6 text-white">
                  <div class="text-subtitle3 text-center">Ultimos 30 Dias</div>
                  <div class="text-subtitle1 text-light-green-13">Total: {{ vendas30.total_price | capitalize }}</div>
                  <div class="text-subtitle2 text-light-green-2">Vendas: {{ vendas30.total_qnt }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-4 q-px-lg">
              <q-card>
                <q-card-section class="bg-grey-6 text-white">
                  <div class="text-subtitle3 text-center">Unidades Vendidas</div>
                  <div class="text-h5 text-light-green-13">Total: {{ itensVendidos }}</div>
                  <p class="text-subtitle2 text-light-green-2"></p>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row justify-between q-mt-xl">
            <div class="col-6 q-px-lg">
              <q-card>
                <q-card-section class="bg-grey-6 text-white">
                  <div class="text-subtitle2 text-center">Produtos Mais Vendidos</div>
                  <div class="text-subtitle1 text-light-green-13">Quantidade: {{ maisVendido.Qnt }}</div>
                  <div class="text-subtitle2 text-light-green-2">Produto: {{ maisVendido.name }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 q-px-lg">
              <q-card>
                <q-card-section class="bg-grey-6 text-white">
                  <div class="text-subtitle3 text-center">Produtos Menos Vendidos</div>
                  <div class="text-subtitle1 text-light-green-13">Quantidade: {{ menosVendido.Qnt }}</div>
                  <div class="text-subtitle2 text-light-green-2">Produto: {{ menosVendido.name }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Loading } from 'quasar'
export default {
  async beforeCreate(){
    Loading.show()
    try {
      const { data } = await this.$axios.get('orders/sellsResume')
      this.vendasDia = data.today
      this.vendas30 = data.month
      this.itensVendidos = data.total_itens
      this.maisVendido = data.bestSellers
      this.menosVendido = data.lessSold
      console.log(data)
    } catch (error) {

    }
    Loading.hide()
  },
  data () {
    return {
      vendasDia: [],
      vendas30: [],
      vendas: [],
      itensVendidos: 0,
      maisVendido: [],
      menosVendido: []
    }
  }
}
</script>
