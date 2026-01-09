<template lang="pug">
    .headerLanguageSelector
        a(v-for="(lang,i) in availableLanguages" :class="{active:lang == currentLanguage}" :href="changeLanguage(lang)" :key="'mainmenu_lang_'+i")
            | {{ lang }}
</template>
<script>
export default {
    data() {
        return {
            changeLanguage(l){
                return this.$route.fullPath.replace(this.currentLanguage,l);
            }
        }
    },
    computed: {
        availableLanguages(){
            return this.$store.state.languages.availableLanguages;
        },
        currentLanguage(){
            return this.$store.state.languages.currentLanguage;
        }
    },
}
</script>