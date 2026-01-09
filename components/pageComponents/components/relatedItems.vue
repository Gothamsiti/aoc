<template lang="pug">
    .relatedItems(:class="{'visible':visible}")
        h3 {{title}}
        .container
            cta(:blok="{link: {linktype:'story',cached_url:'/'+item.full_slug}, label:item.content.title}" v-for="item in list" :key="item.uuid" v-if="item.slug != $route.params.slug")
</template>
<script>
import cta from '~/components/system/utils/cta.vue';
export default {
    components:{
        cta
    },
    computed:{
        title(){
            return this.$route.params.folder == 'service' ? this.$__('moreServices') : this.$__('moreSolutions');
        },
        scrolTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH;
        },
    },
    data(){
        return {
            list: null,
            relatedItemsAnimateHolder:null,
            offsetTop : 0,
            visible: false
        }
    },
    created(){
        this.$nuxt.$on("changeTop", this.initPositions);
        var lang = this.$store.state.languages.currentLanguage == this.$store.state.languages.defaultLanguage ? '' : this.$store.state.languages.currentLanguage + '/';
        var params = {
            version: this.$nuxt.context.isDev ? 'draft' : 'published',
            starts_with: lang+this.$route.params.folder+'/',
            is_startpage: false
        }
        this.$storyapi.get('cdn/stories', params).then(res => {
            this.list = res.data.stories;
        }).catch(err => {
            console.log(err);
        })
    },
    mounted() {
        this.initPositions();
        this.relatedItemsAnimate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.relatedItemsAnimateHolder);
    },
    methods: {
        initPositions(){
            if(this.$el) {
                if(this.$store.state.scroll.wW < 850){
                    this.offsetTop = this.$el.offsetTop + this.$store.state.scroll.wH * 30 / 100 ;
                } else {
                    this.offsetTop = this.$el.offsetTop + this.$el.clientHeight/2;
                }
            }
        },
        relatedItemsAnimate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.relatedItemsAnimateHolder = requestAnimationFrame(time => this.relatedItemsAnimate(time));
        }
    },
}
</script>