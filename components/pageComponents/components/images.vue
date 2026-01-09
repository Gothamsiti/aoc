<template lang="pug">
    .images(:class="[styleClass(), 'i'+blok.images.length]")
        template(v-if="wW > 850")
            imageItem(v-for="image in blok.images" :key="image.id" :blok="{image:[image.image], width: image.width, height: image.height, marginTop: image.marginTop, marginLeft: image.marginLeft}")
        template(v-else)
            imageItem(v-for="image in blok.images" :key="image.id" :blok="{image:[image.image]}")
</template>
<script>
    import imageItem from '~/components/pageComponents/components/imageItem.vue';
export default {
    props : ['blok'],
    components : {
        imageItem
    },
    computed: {
        wW(){
            return this.$store.state.scroll.wW;
        },
    },
    data(){
        return{
            styleClass(){
                var styleClass = null;
                switch(this.blok.images.length){
                    case 3:
                        styleClass = 'masonry'
                        break;
                }
                return styleClass;
            }
        }
    },
}
</script>