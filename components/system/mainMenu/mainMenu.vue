<template lang="pug">
    #mainMenu
        .content
                menuItem(v-for="item in menuItems" :key="item._uid" :blok="item")
        headerLanguageSelector
</template>
<script>
import menuItem from '~/components/system/mainMenu/menuItem.vue';
import headerLanguageSelector from "~/components/system/header/headerLanguageSelector.vue";
export default {
    components : {
        menuItem,
        headerLanguageSelector
    },
    computed:{
        menuItems(){
            return this.$store.state.layout.menuItems
        }
    },
    created(){
        var lang = this.$store.state.languages.currentLanguage == this.$store.state.languages.defaultLanguage ? '' : this.$store.state.languages.currentLanguage + '/';
        var params = {
            version: this.$nuxt.context.isDev ? 'draft' : 'published',
        }
        this.$storyapi.get('cdn/stories/'+lang+'system/mainmenu', params).then(res => {
            this.$store.commit('layout/setMenuItems',res.data.story.content.items)
        }).catch(err => {
            console.log(err);
        })
    }
}
</script>