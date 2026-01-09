<template lang="pug">
    .miniSlider(v-if="images.length > 0")
        .mininav
            a.cta.prev(href="#" v-if="scrollIndex > 0" @click="prev") 
                span {{$__('prev')}}
            a.cta.next(href="#" v-if="scrollIndex < images.length-1" @click="next") 
                span {{$__('next')}}
        .container
            .scrollhider(ref="scrollPane")             
                .slidercont
                    div.slide(v-for="(image,i) in images" :key="'minislider_image_'+i")
                        img2x(:data="image" :crop="true")
</template>
<script>
import img2x from '~/components/system/utils/img2x.vue';
import TWEEN from '@tweenjs/tween.js';
export default {
    components:{
        img2x
    },
    data() {
        return {
            scrollIndex : 0,
            scrollLeft : 0,
            scrollMax : 0,
            scrollStep : 0,
            animateHolder : {}
        }
    },
    props : [
        'images',
    ],
    methods: {
        doMounted(){
            this.$emit('mounted');
        },
        getSizes(){
            this.scrollStep = this.$el.clientWidth;
            this.scrollMax = this.$el.clientWidth * (this.images.length-1);
        },
        prev(){
            this.scrollIndex -= 1;
            this.doScroll();
        },
        next(){
            this.scrollIndex += 1;
            this.doScroll();
        },
        doScroll(){
            if(this.$refs && this.$refs.scrollPane){
                new TWEEN
                    .Tween({x:this.$refs.scrollPane.scrollLeft})
                    .to({x:this.scrollIndex * this.scrollStep},300)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((o) => {
                        this.$refs.scrollPane.scrollLeft = o.x;
                    })
                    .start();
            }
        },
        animate(){
            TWEEN.update();
            this.animateHolder = requestAnimationFrame(this.animate);
        }
    },
    mounted() {
        this.getSizes();
        this.animate();
    },
    beforeDestroy() {
        cancelAnimationFrame(this.animateHolder);
    },
}
</script>