<template lang="pug">
    .seoimg(:class="[data.class]" v-if="data && data.filename && data.filename.length > 0")
        .wrapper(v-if="single")
            template(v-if="data.link")
                a(:href="data.link" target="_blank")
                    img(:title="data.caption" :alt="data.alt ? data.alt : 'Air ocean cargo'" :src="single" :srcset="single + ' 1x,' +double + ' 2x'")
            template(v-else)
                img(:title="data.caption" :alt="data.alt ? data.alt : 'Air ocean cargo'" :src="single" :srcset="single + ' 1x,' +double + ' 2x'")
</template>

<script>
export default {
    props : [
        'data',
        'crop',
        'size'
    ],
    data() {
        return {
            single : null,
            double : null,
            elW: 0,
            elH: 0
        }
    },
    computed:{
        isWebpSupported(){
            return this.$store.state.layout.isWebpSupported;
        },
    },
    watch:{
        data(t,f){
            this.urlCalc();
        }
    },
    mounted(){
        if(this.data && this.data.filename){
            this.calcDimensions();
            this.$emit('urlLoaded');
        }
    },
    methods: {
        calcDimensions(){
            if(this.size){
                this.elW = parseInt(this.size.w);
                this.elH = parseInt(this.size.h);
            }else{
                var size = {w: this.$el.clientWidth, h: this.$el.clientHeight}
                this.elW = parseInt(size.w);
                this.elH = parseInt(size.h);
            }
            this.urlCalc();
        },
        urlCalc(){
            var baseImage = this.data.filename.replace("https:",'');
            baseImage = baseImage.replace("http:",'');
            baseImage = baseImage.replace("//a.storyblok.com/",'');

            var baseImageInfo = baseImage.split("/");
            var baseImageDim = baseImageInfo[2].split("x");
            var fitin = this.crop ? '' : 'fit-in/'
            var urlBase = 'https://img2.storyblok.com/'+fitin;
            var dimParam = this.elW + 'x'  + this.elH + '/';
            var dimDoubleParam = this.elW*2 + 'x' + this.elH*2 + '/';
            if(this.isWebpSupported){
                this.single = urlBase+dimParam+'filters:format(webp)/'+baseImage;
                this.double = urlBase+dimDoubleParam+'filters:format(webp)/'+baseImage;
            } else {
                this.single = urlBase+dimParam+baseImage;
                this.double = urlBase+dimDoubleParam+baseImage;
            }
        }
    },
}
</script>