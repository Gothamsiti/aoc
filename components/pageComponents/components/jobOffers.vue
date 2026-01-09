<template lang="pug">
    .jobOffers(:class="{visible:visible}" v-if="items.length > 0")
        h3 {{title}}
        .section(v-for="item in items" :key="item._uid" :class="{'open':item.open}")
            .title(@click="openItem(item)")
                h4 {{item.title}}
                .plus 
            .content(v-html="$storyapi.richTextResolver.render(item.text)")
</template>

<script>
export default {
    props:['blok','title'],
    data() {
        return {
            items: null,
            jobOffersAnimateHolder:null,
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
        this.items = this.blok;
        for(var i in this.items){
            this.items[i].open = false;
        }
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    mounted() {
        this.initPositions();
        this.jobOffersAnimate();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.jobOffersAnimateHolder);
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
        jobOffersAnimate(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.jobOffersAnimateHolder = requestAnimationFrame(time => this.jobOffersAnimate(time));
        },
        openItem(i){
            for(var j in this.items){
                if(i._uid != this.items[j]._uid){
                    this.items[j].open = false;
                }
            }
            i.open = !i.open;
            this.$forceUpdate();
        }
    },
}
</script>
