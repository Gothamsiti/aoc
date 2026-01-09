
<template lang="pug">
    .contactAddresses(:class="{visible:visible}")
        .row(v-for="row in blok" :key="row._uid")
            h3 {{row.title}}
            .col
                h4 {{row.label}}
            .col(v-html="$storyapi.richTextResolver.render(row.value)")
</template>

<script>
export default {
    props : ['blok'],
    data(){
        return {
            animationHolder:null,
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
        this.animation();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.animationHolder);
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
        animation(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.animationHolder = requestAnimationFrame(time => this.animation(time));
        }
    },
}
</script>