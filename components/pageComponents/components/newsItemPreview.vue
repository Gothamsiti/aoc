<template lang="pug">
    .newsItemPreview
        h3.light.date {{$formatDate(blok.published_at, 'DD/MM/YYYY')}}
        h3 {{blok.content.title}}
        p.text(v-html="$storyapi.richTextResolver.render(blok.content.text.content[0])")
        nuxt-link.cta(:to="$__url('/news/'+blok.slug)" @mouseover.native="$nuxt.$emit('elementOnHover','halo')" @mouseout.native="$nuxt.$emit('elementOnOut','halo')") 
            span {{$__('more')}}
</template>

<script>
export default {
    props:['blok'],
}
</script>