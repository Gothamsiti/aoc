<template lang="pug">
    nuxt-link.service(:to="$__url(blok.full_slug)")
        template(v-if="wW > 1024")
            imageItem(:blok="{image:[blok.content.coverImage],width:4,height:5}")
        template(v-else)
            imageItem(:blok="{image:[blok.content.coverImage]}")
        cta(:blok="{link:{linktype:'story',cached_url:$__url(blok.full_slug)},label:blok.content.title}")
</template>
<script>
import cta from '~/components/system/utils/cta.vue';
import imageItem from '~/components/pageComponents/components/imageItem.vue';
export default {
    components : {
        imageItem,
        cta
    },
    computed: {
        wW(){
            return this.$store.state.scroll.wW;
        },
    },
    props : ['blok']
}
</script>