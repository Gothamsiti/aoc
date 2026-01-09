<template lang="pug">
    .soriesList(v-if="blok.source")
        storyItem(v-for="item in list" :key="item.uuid" :blok="item")
</template>

<script>
import storyItem from '~/components/pageComponents/components/storyItem.vue';
export default {
    props:['blok'],
    components : {
        storyItem
    },
    data(){
        return {
            list : []
        }
    },
    created(){
        if(this.blok.source){
            var lang = this.$store.state.languages.currentLanguage == this.$store.state.languages.defaultLanguage ? '' : this.$store.state.languages.currentLanguage + '/';
            var params = {
                version: this.$nuxt.context.isDev ? 'draft' : 'published',
                starts_with: lang+this.blok.source+'/',
                is_startpage: false
            }
            this.$storyapi.get('cdn/stories', params).then(res => {
                this.list = res.data.stories;
            }).catch(err => {
                console.log(err);
            })
        }
    }
}
</script>