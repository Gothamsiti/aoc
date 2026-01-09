<template lang="pug">
    .editorText(:class="{visible:visible}")
        .content.bigFont(v-html="$storyapi.richTextResolver.render(blok.text)")
</template>

<script>
export default {
    props:['blok'],
    data() {
        return {
            editorTextAnimateHolder:null,
            offsetTop : 0,
            visible: false
        }
    },
    computed: {
        scrolTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH;
        }
    },
    created() {
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    mounted() {
        this.initPositions();
        this.editorTextAnimate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.editorTextAnimateHolder);
    },
    methods: {
        initPositions(){
            if(this.$el) {
                if(this.$store.state.scroll.wW < 850){
                    this.offsetTop = this.$el.offsetTop + this.$store.state.scroll.wH * 30 / 100 ;
                } else {
                    this.offsetTop = this.$el.offsetTop + this.$el.clientHeight/4;
                }
            }
        },
        editorTextAnimate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.editorTextAnimateHolder = requestAnimationFrame(time => this.editorTextAnimate(time));
        }
    },
}
</script>