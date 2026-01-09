<template lang="pug">
    #homepage
        .intro
            template(v-if="!isMetal")
                h1(:style="{transform:'translate('+introX+'px,'+introY*.4+'px)'}" v-html="$toSingleLetters($__('relax'))")
                h2(:style="{transform:'translate('+(introX*.5)+'px,'+(introY*.1)+'px)'}" v-html="$toSingleLetters($__('wevegotthis'))")
            template(v-else)
                h1(:style="{transform:'translate('+introX+'px,'+introY*.4+'px)'}" v-html="$toSingleLetters($__('metalTitle'))")
                h3(:style="{transform:'translate('+(introX*.5)+'px,'+(introY*.1)+'px)'}" v-html="$toSingleLetters($__('metalSubtitle'))")
            p
            svg.scrolldown(@click="scrollTo()" version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='11px' height='20px' viewbox='0 0 11 20' style='overflow:visible;enable-background:new 0 0 11 20;' xml:space='preserve')
                circle(cx='5.5' cy='-7' r='1.5')
                circle(cx='5.5' cy='.5' r='1.5')
                circle(cx='5.5' cy='6.5' r='1.5')
                polygon(points='5.5,20 0,12 11,12 ')
        component(v-for="blok in story.content.body" :blok="blok" :key="blok._uid" :is="blok.component")
</template>
<script>
    import hpCities from '~/components/pageComponents/components/hpCities.vue';
    import ctaSection from '~/components/pageComponents/components/ctaSection.vue';
    import images from '~/components/pageComponents/components/images.vue';
    import storiesList from '~/components/pageComponents/components/storiesList.vue';


    // import mainFooter from '~/components/system/mainFooter/mainFooter';


export default {
    components : {
        hpCities,
        ctaSection,
        images,
        storiesList,
        // mainFooter,
    },
    props : ['story','stories'],
    data() {
        return {
            getClass(d){
                switch (d) {
                    case 0:
                        return 'active';
                        break;
                    case 1:
                    case -1:
                        return 'halfquarter';
                        break;
                    case 2:
                    case -2:
                        return 'half';
                        break;
                    case 3:
                    case -3:
                        return 'quarter';
                        break;
                    default:
                        return 'hide';
                        break;
                }
            },
            getPercent(){
                return parseInt(this.activeSituation)*100;
            },
            introX:0,
            introY:0,
            animateHolder:null,
        }
    },
    computed: {
        mouseX(){
            return this.$store.state.mouse.x*.1;
        },
        mouseY(){
            return this.$store.state.mouse.y*.1;
        },
        situations(){
            return this.$store.state.layout.situations;
        },
        activeSituation : {
            get(){
                return this.$store.state.layout.activeSituation;
            },
            set(v){
                this.$store.commit("layout/setActiveSituation",v);
            }
        },
        isHP(){
            return this.$store.state.layout.isHP;
        },
        mw(){
            return parseInt(this.$store.state.scroll.wW / 20);
        },
        isMetal(){
            return this.$store.state.layout.isMetal;
        }
    },
    mounted() {
        // if(this.$store.state.layout.preloaderGone && this.$store.state.layout.activeSituation != 1) this.$nuxt.$emit("changeSituation",1);
        this.animate();
    },
    methods: {
        // changeSituation(i){
        //     this.$nuxt.$emit("changeSituation",i);
        // },
        animate(time){
            var deltaX = this.introX - this.mouseX;
            var deltaY = this.introY - this.mouseY;
            this.introX = this.introX - deltaX/20;
            this.introY = this.introY - deltaY/20;
            this.animateHolder = window.requestAnimationFrame(time => this.animate(time));
        },
        scrollTo(){
            var offset = this.$children[0].offsetTop - this.$store.state.scroll.top;
            if(offset > 0){
                this.$parent.$el.scroll({
                    top: this.$store.state.scroll.top + offset - 100,
                    left: 0,
                    behavior: 'smooth'
                })
            }
        }
    }
}
</script>