<template>
  <q-page class="flex flex-center bg-grey-6">
    <FormClient/>
    <q-page-container>
        <q-page padding>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="settings" @click="admin" color="accent" />
          </q-page-sticky>
        </q-page>
      </q-page-container>
  </q-page>
</template>

<script>
import FormClient from '../components/FormClient'
export default {
  components: { FormClient },
  name: 'PageIndex',
  methods:{
    admin(){
      this.$router.push('/')
    }
  }
}
</script>
