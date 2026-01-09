<template lang="pug">
  .errorPage
    h1 {{error && error.statusCode ? $__('errorPageTitle')+' '+error.statusCode : $__('errorPageTitle') }}
    h3 {{$__('errorPageGenericText')}}
    .details
      p {{error.message}}
    div
      | {{$__('goBackTo')}}
      a(:href="'/'") Home
</template>

<script>
export default {
    layout: 'default',
    props : ["error"],
    mounted() {
      this.$store.commit("layout/setLoaded",true);
      this.$store.commit("layout/setPreloaderGone",true);
    },
}
</script>