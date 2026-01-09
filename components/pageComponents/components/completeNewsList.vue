<template lang="pug">
    .completeNewsList
        newsItemPreview(v-for="item in stories" :key="item.uuid" :blok="item")
</template>

<script>
import newsItemPreview from '~/components/pageComponents/components/newsItemPreview.vue';
export default {
    props: ['blok','stories'],
    components:{
        newsItemPreview
    },
    mounted(){
        // console.log("",this.stories)
    }
}
</script>