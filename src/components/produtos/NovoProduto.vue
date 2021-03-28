<template>
<div>
  <div>
    <!-- DIALOG PARA CADASTRAR ITENS -->
    <q-dialog v-model="dialog" >
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center no-wrap">
          <q-form ref="productForm">
            <div class="row text-h6">
              <div class="col q-px-sm">
                {{title}} Produto
              </div>
            </div>
            <div class="row">
              <div class="col-12 q-px-sm ">
                <q-input filled v-model="produto.name" label="Nome do produto" lazy-rules :rules="[
                                  val => val && val.length > 0 || 'Informe o nome da cateoria',
                                  val => val && val.length < 11 || 'Maximo de 11 caracteres'
                                  ]" />
              </div>
              <div class="col-12 q-px-sm">
                <q-input filled type="price" v-model="produto.price" label="Preço do produto" lazy-rules :rules="[
                                    val => val !== null && val !== '' || 'Informe uma descrição'
                                    ]" />
              </div>
            </div>
            <div class="row">
              <div class="col-4 q-px-sm">
                <q-btn  @click="dialog = false" class="btn-fixed-width" color="grey" label="Voltar" />
              </div>
              <div class="col-4 q-px-sm text-center">
                <q-btn  @click="remove" color="red-5" label="Remover" />
              </div>
              <div class="col-4 q-px-sm text-right">
                <q-btn  @click="cadastrar" class="btn-fixed-width" color="secondary" :label="title" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- DIALOG PARA CADASTRAR ITENS -->
  </div>
</div>
</template>

<script>
import barramento from '../../barramento'
import {
  Loading
} from 'quasar'
export default {
  beforeCreate(){
    barramento.$on('editaProduto', produto => {
      if(produto != 'novo') {
        this.title = "Atualizar"
        this.produto = produto
        this.dialog = true
      }else{
        this.title = "Cadastrar"
        this.produto = {}
        this.dialog = true
      }
    })
  },
  data () {
    return {
      produto: {
        price: null,
        name: null,
      },
      title: '',
      dialog: false
    }
  },
  methods: {
    async cadastrar () {
      Loading.show()
      try {
        if(this.title == 'Cadastrar'){
          const { data } = await this.$axios.post('products/new', this.produto)
          this.$refs.productForm.resetValidation()
          this.produto = {}
          this.dialog = false
          this.$q.notify({
            message: 'Produto Cadastrado com sucesso',
            color: 'green'
          })
          barramento.$emit('atualizaListaProdutos', data.data)
        } else {
          const { data } = await this.$axios.put('products/update/' + this.produto.id, this.produto)
          this.$refs.productForm.resetValidation()
          this.produto = {}
          this.dialog = false
          this.$q.notify({
            message: 'Produto Atualizado com sucesso',
            color: 'green'
          })
          barramento.$emit('atualizaListaProdutos', data)
        }
      } catch {
        this.$q.notify({
          message: 'Erro ao cadastrar produto',
          color: 'red'
        })
      }
      Loading.hide()
      // location.reload()
    },
    async remove(){
      Loading.show()
      try {
        const { data } = await this.$axios.delete('products/delete/' + this.produto.id)
        this.$refs.productForm.resetValidation()
        this.produto = {}
        this.dialog = false
        this.$q.notify({
          message: 'Produto removido com sucesso',
          color: 'green'
        })
        barramento.$emit('removeListaProdutos', data.data)
      } catch {
        this.$q.notify({
          message: 'Já ouve vendas do produto',
          color: 'red'
        })
      }
      Loading.hide()
    }
  }
}
</script>

<style>
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;

}
</style>
