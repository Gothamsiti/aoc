<template lang="pug">
    .image( :class="{visible:visible}" :style="computeStyle()" )
        .container(:style="{ transform:'translateY('+top+'px) translateZ(0)'}")
            template(v-if="load && visible")
                template(v-if="isMultiple" v-for="(image,i) in blok.image" )
                    img2x(v-for="n in imageMultiplyer" :crop="true" :key="image.id+'_'+n" :class="{'visible': curImage == i}" :data="image" :size="imageSize()" :style="{transform:'translate('+mouse.x*(n*coeff)*2+'px,'+mouse.y*(n*coeff)*.5+'px)'}")
                template(v-else)
                    img2x.visible(:data="blok.image[0]" :crop="true" :size="{w:imageSize().w, h:imageSize().h+(imageSize().h * 30 / 100)}")
</template>
<script>
import img2x from '~/components/system/utils/img2x.vue';
export default {
    props : ['blok'],
    components : {
        img2x
    },
    data() {
        return {
            curImage : 0,
            animateCounter : 0,
            isMultiple : false,
            imageAnimateHolder:null,
            minParallax: .1,
            maxParallax: .1,
            keyfake: 1,
            offsetTop : 0,
            top: 0,
            visible: false,
            load: false,
            heightCalculated : 0,
            heightDeltaCalculated : 0,
            deltaTop : 0,
            computeStyle(){
                return{ 
                    width:this.$mw(this.blok.width), 
                    height:this.$mw(this.blok.height),
                    marginTop: this.blok.marginTop ? this.$mw(this.blok.marginTop) : null,
                    marginLeft: this.blok.marginLeft ? this.$mw(this.blok.marginLeft) : null 
                }
            },
            imageSize(){
                if(this.blok.width && this.blok.height){
                    return {
                        w: this.$mwToPx(this.blok.width,this.wW),
                        h: this.$mwToPx(this.blok.height,this.wW),
                    }
                } else {
                    return {
                        w: this.$el.clientWidth,
                        h: this.$el.clientHeight,
                    }
                }
            },
            imageMultiplyer: 1,
            coeff : 20
        }
    },
    computed: {
        wH(){
            return this.$store.state.scroll.wH;
        },
        wW(){
            return this.$store.state.scroll.wW;
        },
        whOffset(){
            return (this.wH/4*3);
        },
        scrollTop(){
            return this.$store.state.scroll.top + this.whOffset;
        },
        mouse(){
            return {
                x : this.$store.state.mouse.x / (this.$store.state.scroll.wW/4),
                y: (this.$store.state.mouse.y - (this.offsetTop - this.originalScrollTop)*.5 ) / (this.$store.state.scroll.wH/8)
            }
        },
        originalScrollTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH/2;
        },
    },
    watch : {
        scrollTop(t){
            this.deltaTop = this.offsetTop - t;
        }
    },
    created() {
        if(this.blok.image.length > 1) this.isMultiple = true;
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    mounted() {
        this.initPositions();
        this.imageAnimate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.imageAnimateHolder);
    },
    methods: {
        initPositions(){
            if(this.$el){ 
                this.offsetTop = this.$el.offsetTop;
                this.random = this.minParallax + Math.random() * this.maxParallax;
                this.heightCalculated = this.$el.clientHeight;
                this.heightDeltaCalculated = (this.$el.querySelector(".container").clientHeight - this.$el.clientHeight);
            }
        },
        imageAnimate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            if(this.isMultiple){
                if(this.animateCounter < 10){
                    this.animateCounter ++
                }else{
                    this.curImage = this.curImage + 1 < this.blok.image.length ? this.curImage + 1 : 0;
                    this.animateCounter = 0;
                }
            }else{
                this.deltaTop = Math.abs(this.deltaTop) < .005 ? 0 : this.deltaTop;
                if(this.deltaTop) this.top = (this.deltaTop/(this.whOffset+this.heightCalculated)) * this.heightDeltaCalculated;
            }
            this.visible = this.offsetTop < this.scrollTop;
            if(!this.load){
                this.load = this.offsetTop-this.wH < this.scrollTop;
            }
            this.imageAnimateHolder = requestAnimationFrame(time => this.imageAnimate(time));
        }
    },
}
</script>