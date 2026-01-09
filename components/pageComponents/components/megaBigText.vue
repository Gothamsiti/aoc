<template lang="pug">
    .megaBigText(v-if="coordinates.length > 0")
        .row(v-for="(row,i) in phrase" :key="'megabigtext-row-'+i" :style="{marginLeft:lefts[i]+'px'}")
            .phrase(v-for="k in 5" :key="'megabigtext-row-'+i+'-phrase-'+k")
                .word(v-for="(word,j) in phrase" :class="k == 3 && i == j ? 'strong' : 'outline'" :key="'megabigtext-row-'+i+'-phrase-'+k+'-word-'+j") {{ word.text }}
</template>
<script>
    export default {
        props : ['blok'],
        data() {
            return {
                phrase : [],
                animateHolder:null,
                coordinates:[],
                lefts : [],
                tops : [],
                animating : false
            }
        },
        computed: {
            wW(){
                return this.$store.state.scroll.wW;
            },
            wH(){
                return this.$store.state.scroll.wW;
            },
            scrollTop(){
                return this.$store.state.scroll.top;
            },
            preloaderGone(){
                return this.$store.state.layout.preloaderGone;
            },
            leavePage(){
                return this.$store.state.layout.leavePage;
            }
        },
        watch: {
            leavePage(t,f){
                if(!t && !this.animating) this.animate();
            },
            preloaderGone(t,f){
                if(t && !this.animating) this.animate();
            }
        },
        created() {
            this.phrase = this.blok.phrase;
            for(var i in this.phrase){
                this.coordinates[i] = 0;
            }
        },
        mounted() {
            if(this.$el.querySelectorAll){
                var rows = this.$el.querySelectorAll('.row');
                for(var i in rows){
                    if(rows[i] instanceof HTMLElement){
                        var b = rows[i].querySelector(".strong");
                        this.coordinates[i] = -(b.offsetLeft+b.clientWidth/2-this.wW/2);
                        this.tops[i] = rows[i].offsetTop + rows[i].clientHeight/2;
                        this.lefts[i] = -(b.offsetLeft+b.clientWidth/2-this.wW/2);
                    }
                }
                this.$forceUpdate();
            }
        },
        beforeDestroy() {
            cancelAnimationFrame(this.animateHolder);
        },
        methods: {
            animate(){
                var changedDelta = false;
                for(var i in this.coordinates){
                    var distanceOffset = (this.tops[i] - (this.scrollTop + this.wH/4)) * (i * .4);
                    var targetLeftDelta = this.lefts[i] - (this.coordinates[i] + distanceOffset);
                    targetLeftDelta = Math.abs(targetLeftDelta) < .005 ? 0 : targetLeftDelta;
                    if(Math.abs(targetLeftDelta) > 0){
                        changedDelta = true;
                        this.lefts[i] = this.lefts[i] - targetLeftDelta/5;
                    }
                }
                if(changedDelta){
                    this.$forceUpdate();
                }
                this.animateHolder = requestAnimationFrame(time => this.animate(time));
            }
        },
    }
</script>