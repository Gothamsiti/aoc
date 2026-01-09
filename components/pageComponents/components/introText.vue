<template lang="pug">
    .introText(:class="{visible:visible}")
        h4(v-html="$storyapi.richTextResolver.render(blok.text)")
        .text(v-html="$storyapi.richTextResolver.render(blok.right)")
</template>
<script>
export default {
    props : ['blok'],
    data() {
        return {
            introTextAnimateHolder:null,
            offsetTop : 0,
            visible: false
        }
    },
    computed: {
        scrolTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH;
        },

    },
    created() {
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    mounted() {
        this.initPositions();
        this.introTextAnimate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.introTextAnimateHolder);
    },
    methods: {
        initPositions(){
            if(this.$el){
                if(this.$store.state.scroll.wW < 850){
                    this.offsetTop = this.$el.offsetTop + this.$store.state.scroll.wH * 30 / 100 ;
                } else {
                    this.offsetTop = this.$el.offsetTop + this.$el.clientHeight/2;
                }
            } 
        },
        introTextAnimate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.introTextAnimateHolder = requestAnimationFrame(time => this.introTextAnimate(time));
        }
    },
}
</script>