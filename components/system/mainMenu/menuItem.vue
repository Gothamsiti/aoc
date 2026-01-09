<template lang="pug">
    .col
        nuxt-link(v-if="blok.url && blok.url.cached_url && blok.target != '_blank'" :to="$__url(blok.url.cached_url)" @mouseover.native="$nuxt.$emit('elementOnHover','halo')" @mouseout.native="$nuxt.$emit('elementOnOut','halo')")
            .number {{blok.apex}}
            | {{blok.title}}
        a(v-else :href="blok.url.url" target="_blank" @mouseover="$nuxt.$emit('elementOnHover','halo')" @mouseout="$nuxt.$emit('elementOnOut','halo')")
            .number {{blok.apex}}
            | {{blok.title}}
</template>

<script>
export default {
    props: ['blok']
}
</script>