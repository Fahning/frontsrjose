import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios.create({
  baseURL: 'http://barsrjose.test/api/'
})
