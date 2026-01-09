<template lang="pug">
    .breadcrumbs.visible(v-if="folder != 'pages' && $route.params.slug")
        span
            nuxt-link(:to="$__url('/'+$route.params.folder+'/')") {{folder}}
            |  / 
            span {{title}}
</template>

<script>
export default {
    props:['title'],
    computed:{
        folder(){
            if(this.$route.params.folder == 'solutions' && this.$route.params.lang == 'it') return 'soluzioni';
            if(this.$route.params.folder == 'services' && this.$route.params.lang == 'it') return 'servizi';
            return this.$route.params.folder;
        }
    },
}
</script>