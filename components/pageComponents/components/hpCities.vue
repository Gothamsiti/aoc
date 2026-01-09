<template lang="pug">
    .separator
        .cities(:style="{ transform:'translateY('+top*.2+'px) translateZ(0)'}")
            .row(v-for="(row,i) in blok.list" :key="'cities-'+rand()+i" :style="{transform: i > 0 ? 'translateY('+(top > 0 ? top*i : 0)+'px) translateZ(0)' : '',opacity:opacity}" v-html="row.text")
            .rowMobile(v-for="(row,i) in blok.listMobile" :key="'citiesMobile-'+rand()+i" :style="{transform: i > 0 ? 'translateY('+(top > 0 ? top*i : 0)+'px) translateZ(0)' : '',opacity:opacity}" v-html="row.text")
        imageItem(:blok="imageItemBlok")
</template>
<script>
import imageItem from '~/components/pageComponents/components/imageItem.vue';

export default {
    components : {
        imageItem
    },
    props : ['blok'],
    data() {
        return {
            rand(){
                return parseInt(Math.random()*100);
            },
            animateHolder : null,
            timeOlder : 0,
            fakeLettersCount : 0,
            minParallax: .1,
            maxParallax: .1,
            random: 0,
            top:0,
            offsetTop : 0,
            opacity : 0,
        }
    },
    created() {
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    computed: {
        originalTop(){
            return this.$store.state.scroll.top;
        },
        wH(){
            return this.$store.state.scroll.wH;
        },
        wW(){
            return this.$store.state.scroll.wW;
        },
        scrollTop(){
            return this.$store.state.scroll.top+this.$store.state.scroll.wH/4;
        },
        imageItemBlok(){
            if(this.wW <= 850){
                return {image: this.blok.images}
            } else {
                return {image: this.blok.images, width: this.blok.imageWidth, height: this.blok.imageHeight, marginTop: this.blok.marginTop, marginLeft: this.blok.marginLeft}
            }
        }
    },
    mounted() {
        this.animate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.animateHolder);
    },
    methods: {
        initPositions(){
            if(this.$el) this.offsetTop = this.$el.offsetTop;
            this.random = this.minParallax + Math.random() * this.maxParallax;
        },
        animate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.opacity = Math.min(this.originalTop / (this.wH/4),1);
            var deltaTop = this.offsetTop - this.scrollTop;
            deltaTop = Math.abs(deltaTop) < .005 ? 0 : deltaTop;
            if(deltaTop) this.top = deltaTop * this.random;
            this.animateHolder = window.requestAnimationFrame(time => this.animate(time));
        },
    }
}
</script>