<template>
<div>
  <div>
    <!-- DIALOG PARA CADASTRAR ITENS -->
    <q-dialog v-model="dialog" >
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center no-wrap">
          <q-form ref="clientForm">
            <div class="row text-h6">
              <div class="col q-px-sm">
                {{title}} Cliente
              </div>
            </div>
            <div class="row">
              <div class="col-12 q-px-sm ">
                <q-input filled v-model="cliente.name" label="Nome do cliente" lazy-rules :rules="[
                                  val => val && val.length > 0 || 'Informe o nome da cateoria',
                                  val => val && val.length < 11 || 'Maximo de 11 caracteres'
                                  ]" />
              </div>
              <div class="col-12 q-px-sm">
                <q-input filled type="email" v-model="cliente.email" label="Email do cliente" lazy-rules :rules="[
                                    val => val !== null && val !== '' || 'Informe uma descrição'
                                    ]" />
              </div>
              <div class="col-12 q-px-sm">
                <q-input filled type="text" v-model="cliente.phone" label="Telefone do cliente" lazy-rules :rules="[
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
    barramento.$on('editaCliente', cliente => {
      if(cliente != 'novo') {
        this.title = "Atualizar"
        this.cliente = cliente
        this.dialog = true
      }else{
        this.title = "Cadastrar"
        this.cliente = {}
        this.dialog = true
      }
    })
  },
  data () {
    return {
      cliente: {
        phone: null,
        name: null,
        email: null
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
          const { data } = await this.$axios.post('clients/new', this.cliente)
          this.$refs.clientForm.resetValidation()
          this.cliente = {}
          this.dialog = false
          this.$q.notify({
            message: 'Cliente Cadastrado com sucesso',
            color: 'green'
          })
          barramento.$emit('atualizaListaClientes', data.data)
        } else {
          const { data } = await this.$axios.put('clients/update/' + this.cliente.id, this.cliente)
          this.$refs.clientForm.resetValidation()
          this.cliente = {}
          this.dialog = false
          this.$q.notify({
            message: 'Cliente Atualizado com sucesso',
            color: 'green'
          })
          barramento.$emit('atualizaListaClientes', data)
        }
      } catch {
        this.$q.notify({
          message: 'Erro ao cadastrar cliente',
          color: 'red'
        })
      }
      Loading.hide()
      // location.reload()
    },
    async remove(){
      Loading.show()
      try {
        const { data } = await this.$axios.delete('clients/delete/' + this.cliente.id)
        this.$refs.clientForm.resetValidation()
        this.cliente = {}
        this.dialog = false
        this.$q.notify({
          message: 'Cliente removido com sucesso',
          color: 'green'
        })
        barramento.$emit('removeListaClientes', data.data)
      } catch {
        this.$q.notify({
          message: 'Erro ao remover cliente',
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
