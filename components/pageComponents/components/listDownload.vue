<template lang="pug">
    .listDownload(:class="{'visible':visible}")
        h3(v-html="blok.title" v-if="blok.title")
        dowloadFile(v-for="(file,i) in blok.files" :key="'download-file-'+i" :file="file")
        span.bigFont(v-for="(item,i) in blok.noFileList" :key="'nofile-'+i") {{ item.text }}
</template>
<script>
    import dowloadFile from '~/components/pageComponents/components/dowloadFile.vue'
export default {
    components : {
        dowloadFile
    },
    props : ['blok'],
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
        }
    },
}
</script>