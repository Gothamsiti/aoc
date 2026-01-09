<template lang="pug">
    .listVideo(:class="{'visible':visible}")
        .video(v-for="video in blok" :key="video._uid" @click="openVideo(video.id)")
            svg(version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='8.4px' height='11px' viewbox='0 0 8.4 11' style='overflow:visible;enable-background:new 0 0 8.4 11;' xml:space='preserve')
                polygon(points='8.4,5.5 0,0 0,11 ')
            .title.bigFont {{video.title }}
</template>

<script>
export default {
    props:['blok'],
    data() {
        return {
            listDownloadAnimateHolder:null,
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
        this.listDownloadAnimate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.listDownloadAnimateHolder);
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
        listDownloadAnimate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.listDownloadAnimateHolder = requestAnimationFrame(time => this.listDownloadAnimate(time));
        },
        openVideo(v){
            this.$store.commit('videoModal/setAsset', v);
            this.$store.commit('videoModal/setModalVideoOpen', true);
        }
    },
}
</script>