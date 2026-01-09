<template lang="pug">
    #preloader(:class="{active:preloading,loaded:loaded}")
        .content
            earpods
            p
                strong PRELOADING
            p
                | BETTER EXPERIENCE WITH HEADPHONES
        a.ready(href="#" @click.prevent="audioConfirm" @mouseover="$nuxt.$emit('elementOnHover','halo')" @mouseout="$nuxt.$emit('elementOnOut','halo')")
            div
                strong SOUND ON?
                br
                strong PLAY

</template>
<script>
  import * as THREE from 'three'; 
    import earpods from '~/components/system/preloader/earpods.vue';
export default {
    data() {
        return {
            // preloading : true
        }
    },
    components : {
        earpods
    },
    computed: {
      loaded(){
        return this.$store.state.layout.loaded;
      },
      preloading(){
        return this.$store.state.layout.preloading;
      }
    },
    watch: {
        loaded(t,f){
            if(!f && t){
                setTimeout(() => {
                    // 
                }, 3400);
            }
        }
    },
    methods: {
        audioConfirm(){
            window.Threelistener = new THREE.AudioListener();
            window.ThreeAudio = new THREE.Audio( window.Threelistener );

            window.mediaElement = new Audio( '/audio/fakeaudio.mp3' );
            window.mediaElement.loop = true;
            window.mediaElement.volume = 0;
            window.mediaElement.play();
            window.ThreeAudio.setMediaElementSource( window.mediaElement );
            window.analyser = new THREE.AudioAnalyser( window.ThreeAudio, 128 );
            // this.preloading = false;
            setTimeout(() => {
                window.mediaElement.pause();
                this.$store.commit("layout/setPreloaderGone",true);
            },600)
        }
    },
}
</script>