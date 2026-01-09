<template lang="pug">
    nuxt-link.cta(v-if="blok.link.linktype == 'story'" :to="blok.link.cached_url"  @mouseover.native="$nuxt.$emit('elementOnHover','halo')" @mouseout.native="$nuxt.$emit('elementOnOut','halo')")
        span {{blok.label}}
    a.cta(v-else :href="blok.link.cached_url" target="_blank" @mouseover="$nuxt.$emit('elementOnHover','halo')" @mouseout="$nuxt.$emit('elementOnOut','halo')")
        span {{blok.label}}
</template>

<script>
export default {
    props: ['blok']
}
</script>