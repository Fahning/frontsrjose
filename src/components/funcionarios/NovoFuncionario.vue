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
                {{title}} Funcionario
              </div>
            </div>
            <div class="row">
              <div class="col-12 q-px-sm ">
                <q-input filled v-model="funcionario.name" label="Nome do funcionario" lazy-rules :rules="[
                                  val => val && val.length > 0 || 'Informe o nome da cateoria',
                                  val => val && val.length < 11 || 'Maximo de 11 caracteres'
                                  ]" />
              </div>
              <div class="col-12 q-px-sm">
                <q-input filled type="email" v-model="funcionario.email" label="Email do funcionario" lazy-rules :rules="[
                                    val => val !== null && val !== '' || 'Informe uma email'
                                    ]" />
              </div>
              <div class="col-12 q-px-sm">
                <q-input filled type="text" v-model="funcionario.phone" label="Telefone do funcionario" lazy-rules :rules="[
                                    val => val !== null && val !== '' || 'Informe uma função'
                                    ]" />
              </div>
              <div class="col-12 q-px-sm">
                <q-input filled type="text" v-model="funcionario.role" label="Função do funcionario" lazy-rules :rules="[
                                    val => val !== null && val !== '' || 'Informe uma função'
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
import { Loading } from 'quasar'
export default {
  beforeCreate(){
    barramento.$on('editaFuncionario', funcionario => {
      if(funcionario != 'novo') {
        this.title = "Atualizar"
        this.funcionario = funcionario
        this.dialog = true
      }else{
        this.title = "Cadastrar"
        this.funcionario = {}
        this.dialog = true
      }
    })
  },
  data () {
    return {
      funcionario: {
        phone: null,
        name: null,
        email: null,
        role: null
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
          const { data } = await this.$axios.post('clients/new', this.funcionario)
          this.$refs.clientForm.resetValidation()
          this.funcionario = {}
          this.dialog = false
          this.$q.notify({
            message: 'Funcionarios Cadastrado com sucesso',
            color: 'green'
          })
          barramento.$emit('atualizaListaFuncionarios', data.data)
        } else {
          const { data } = await this.$axios.put('clients/update/' + this.funcionario.id, this.funcionario)
          this.$refs.clientForm.resetValidation()
          this.funcionario = {}
          this.dialog = false
          this.$q.notify({
            message: 'Funcionario Atualizado com sucesso',
            color: 'green'
          })
          barramento.$emit('atualizaListaFuncionario', data)
        }
      } catch {
        this.$q.notify({
          message: 'Erro ao cadastrar funcionario',
          color: 'red'
        })
      }
      Loading.hide()
      // location.reload()
    },
    async remove(){
      Loading.show()
      try {
        const { data } = await this.$axios.delete('clients/delete/' + this.funcionario.id)
        this.$refs.clientForm.resetValidation()
        this.funcionario = {}
        this.dialog = false
        this.$q.notify({
          message: 'Cliente removido com sucesso',
          color: 'green'
        })
        barramento.$emit('removeListaClientes', data.data)
      } catch {
        this.$q.notify({
          message: 'Erro ao remover funcionario',
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
