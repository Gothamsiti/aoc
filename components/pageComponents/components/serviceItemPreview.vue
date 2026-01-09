<template lang="pug">
    nuxt-link.serviceItemPreview(:to="$__url('/'+blok.full_slug)")
        ThreeDText(:text="blok.content.title" :forceCoeff=".5")
        template(v-if="wW > 850")
            imageItem.i1full(:blok="{image:[blok.content.coverImage], width: 8, height: 9}")
        template(v-else)
            imageItem.i1full(:blok="{image:[blok.content.coverImage]}")
        .cta(@mouseover="$nuxt.$emit('elementOnHover','halo')" @mouseout="$nuxt.$emit('elementOnOut','halo')")
            span {{$__('showMore')}}
</template>

<script>
import ThreeDText from '~/components/pageComponents/components/ThreeDText.vue';
import imageItem from '~/components/pageComponents/components/imageItem.vue';
export default {
    props:['blok'],
    components:{
        ThreeDText,
        imageItem
    },
    computed: {
        wW(){
            return this.$store.state.scroll.wW;
        },
    }
}
</script>