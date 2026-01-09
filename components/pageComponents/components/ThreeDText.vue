<template lang="pug">
    .ThreeDText(:class="{visible:visible}")
        h1.black(v-html="text" :style="{transform:'translate3d('+mouse.x*(3*forceCoeffInt)*coeff+'px,'+mouse.y*(4*forceCoeffInt)**coeff+'px,0)'}")
        h1.black(v-html="text" :style="{transform:'translate3d('+mouse.x*(2*forceCoeffInt)*coeff+'px,'+mouse.y*(3*forceCoeffInt)**coeff+'px,0)'}")
        h1.black(v-html="text" :style="{transform:'translate3d('+mouse.x*(1*forceCoeffInt)*coeff+'px,'+mouse.y*(1*forceCoeffInt)*coeff+'px,0)'}")
</template>
<script>
export default {
    props : ['text','forceCoeff'],
    data() {
        return {
            animateHolder:null,
            coeff: 0,
            maxCoeff : 2,
            visible:false,
            forceCoeffInt : 1
        }
    },
    created() {
        this.forceCoeffInt = this.forceCoeff ? this.forceCoeff : this.forceCoeffInt;
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    mounted() {
        this.animate();
    },
    beforeDestroy(){
        window.cancelAnimationFrame(this.animate);
    },
    computed: {
        mouse(){
            return {
                x : this.$store.state.mouse.x / (this.$store.state.scroll.wW/4),
                y: (this.$store.state.mouse.y - (this.offsetTop - this.originalScrollTop)*.5 ) / (this.$store.state.scroll.wH/8)
            }
        },
        originalScrollTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH/2;
        },
        scrollTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH/4*3;
        }
    },
    methods: {
        initPositions(){
            if(this.$el) this.offsetTop = this.$el.offsetTop;
        },
        animate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrollTop;
            if(this.$store.state.scroll.wW >= 850){
                if(this.visible && this.coeff < this.maxCoeff){
                    this.coeff += .1;
                }
                if(!this.visible && this.coeff > 0){
                    this.coeff -= .1;
                }
            }
            this.animateHolder = window.requestAnimationFrame(time => this.animate(time));
        }
    },
}
</script>