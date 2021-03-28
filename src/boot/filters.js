export default ({ Vue }) => {
  Vue.filter('capitalize', function (value) {
    if (!value) return 'R$ ' + 0
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }, 0)
  })
}
