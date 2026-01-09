<template lang="pug">
    footer#mainFooter
        .content(v-if="story")
            .top(v-if="route.params.slug != 'contacts'")
                .h3 {{story.content.subtitle}}
                .title
                    ThreeDText.black(:text="story.content.title")
                nuxt-link.cta(v-if="$route.params.slug != 'live-animals'" :to="$__url(story.content.link.cached_url)" @mouseover.native="$nuxt.$emit('elementOnHover','halo')" @mouseout.native="$nuxt.$emit('elementOnOut','halo')") 
                    span {{$__('contactUs')}}
                a.cta(v-else :href="'mailto:'+$__('emailPetDivision')" @mouseover="$nuxt.$emit('elementOnHover','halo')" @mouseout="$nuxt.$emit('elementOnOut','halo')") 
                    span {{$__('emailUs')}}
            .bottom
                div
                    .copy(v-html="parsedContent(story.content.copy)")
                    

                div
                    .privacy
                        div
                            a(v-if="story.content.privacyLink.linktype == 'url'" :href="story.content.privacyLink.cached_url" target="_blank" rel="noreferrer")
                                | privacy policy
                            nuxt-link(v-else :to="$__url(story.content.privacyLink.cached_url)")
                                | privacy policy
                            |  - 
                            a(v-if="story.content.cookieLink.linktype == 'url'" :href="story.content.cookieLink.cached_url" target="_blank" rel="noreferrer")
                                | cookie policy
                            nuxt-link(v-else :to="$__url(story.content.cookieLink.cached_url)")
                                | cookie policy
                        .social
                            span follow us on: 
                            a(:href="story.content.linkedinLink.cached_url" target="_blank" rel="noreferrer")
                                .faketext linkedin
                                svg(width='19px' height='19px' viewbox='0 0 19 19' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink')
                                    g#Symbols(stroke='none' stroke-width='1' fill='none' fill-rule='evenodd')
                                        g#footer(transform='translate(-1260.000000, 0.000000)' fill-rule='nonzero')
                                            g(id='ant-design:linkedin-outlined-2' transform='translate(1258.000000, -2.000000)')
                                                g(id='ant-design:linkedin-outlined')
                                                g#Icon(transform='translate(2.156250, 2.156250)' fill='#D2D2D2')
                                                    path#Icon-Shape(d='M16.8838867,0.359375 L1.80361328,0.359375 C1.00625,0.359375 0.359375,1.00625 0.359375,1.80361328 L0.359375,16.8838867 C0.359375,17.68125 1.00625,18.328125 1.80361328,18.328125 L16.8838867,18.328125 C17.68125,18.328125 18.328125,17.68125 18.328125,16.8838867 L18.328125,1.80361328 C18.328125,1.00625 17.68125,0.359375 16.8838867,0.359375 Z M16.8838867,16.890625 C6.82587891,16.8883789 1.796875,16.8861328 1.796875,16.8838867 C1.79912109,6.82587891 1.80136719,1.796875 1.80361328,1.796875 C11.8616211,1.79912109 16.890625,1.80136719 16.890625,1.80361328 C16.8883789,11.8616211 16.8861328,16.890625 16.8838867,16.890625 Z M3.02324219,7.09541016 L5.68935547,7.09541016 L5.68935547,15.6709961 L3.02324219,15.6709961 L3.02324219,7.09541016 Z M4.35742188,5.92294922 C5.20869141,5.92294922 5.90273437,5.23115234 5.90273437,4.37763672 C5.90273437,3.82554973 5.60819949,3.31540031 5.13007813,3.03935681 C4.65195678,2.76331331 4.06288697,2.76331331 3.58476562,3.03935681 C3.10664426,3.31540031 2.81210392,3.82554973 2.81210392,4.37763672 C2.80986328,5.23115234 3.50166016,5.92294922 4.35742188,5.92294922 Z M10.0243164,11.428125 C10.0243164,10.3095703 10.2376953,9.22695313 11.6235352,9.22695313 C12.9891602,9.22695313 13.009375,10.5049805 13.009375,11.5 L13.009375,15.6709961 L15.6732422,15.6709961 L15.6732422,10.9676758 C15.6732422,8.65869141 15.1746094,6.88203125 12.4770508,6.88203125 C11.1810547,6.88203125 10.3118164,7.59404297 9.9546875,8.26787109 L9.91875,8.26787109 L9.91875,7.09541016 L7.36044922,7.09541016 L7.36044922,15.6709961 L10.0243164,15.6709961 L10.0243164,11.428125 Z')
                                                rect#ViewBox(x='0' y='0' width='23' height='23')
                    .gotham
                        a(href="https://gothamsiti.it/" target="_blank" rel="noreferrer")
                            .faketext Gothamsiti
                            svg(width='12px' height='16px' viewbox='0 0 12 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink')
                                g#Symbols(stroke='none' stroke-width='1' fill='none' fill-rule='evenodd')
                                    g#footer(transform='translate(0.000000, -74.000000)' fill='#B9B9B9')
                                        path#gothamsiti(d='M5.99147442,84 C8.18766392,84 10,82.2092126 10,80.0176783 C10,77.826144 8.18766392,76 5.99147442,76 C3.79528492,76 2,77.826144 2,80.0176783 C2,82.2092126 3.79528492,84 5.99147442,84 M11.6740288,88 C11.8457586,88 12,88.1373515 12,88.2902272 L12,89.7097235 C12,89.8625992 11.8457586,90 11.6740288,90 L0.325915814,90 C0.154241361,90 0,89.8625992 0,89.7097235 L0,88.2902272 C0,88.1373515 0.154241361,88 0.325915814,88 L11.6740288,88 Z M5.99150436,74 C9.32965588,74 12,76.6829226 12,80.016609 C12,83.3496322 9.32965588,86 5.99150436,86 C2.65329748,86 0,83.3496322 0,80.016609 C0,76.6829226 2.65329748,74 5.99150436,74 Z')



                
</template>
<script>
import ThreeDText from '~/components/pageComponents/components/ThreeDText.vue';

export default {
    components:{
        ThreeDText
    },
    data() {
        return {
            footerAnimateHolder : null,
            footerOffsetTop : 0,
            story: null
        }
    },
    computed:{
        route(){
            return this.$route
        }
    },
    created(){
        var lang = this.$store.state.languages.currentLanguage == this.$store.state.languages.defaultLanguage ? '' : this.$store.state.languages.currentLanguage + '/';
        var params = {
            version: this.$nuxt.context.isDev ? 'draft' : 'published',
        }
        this.$storyapi.get('cdn/stories/'+lang+'system/mainfooter', params).then(res => {
            this.story = res.data.story;
        }).catch(err => {
            console.log(err);
        })
    },
    mounted() {
        this.footerAnimate();
        
    },
    beforeDestroy(){
        cancelAnimationFrame(this.footerAnimateHolder);
    },
    methods: {
      footerAnimate(){
          var ot = this.$el.offsetTop;
          if(ot != this.footerOffsetTop){
              this.footerOffsetTop = ot;
              this.$nuxt.$emit("changeTop");
          }
          this.footerAnimateHolder = window.requestAnimationFrame(time => this.footerAnimate(time));
      },
        parsedContent(c){
            if(this.$store.state.scroll.wW < 850){   
                return c.replace(/\|/g,'').replace(/-/g,'');
            } else {
                return c;
            }
        }  
    },
}
</script>