<template lang="pug">
    .headerPlayer(v-if="song" :class="{'show':!song.isMetal}")
        .desktop
            //- a(@click.prevent="letsPlay" href="#" v-if="activeSituation == 0" title="lets play") 
            //-     | Lets Play
            //-     svg(version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='8.4px' height='11px' viewbox='0 0 8.4 11' style='overflow:visible;enable-background:new 0 0 8.4 11;' xml:space='preserve')
            //-         polygon(points='8.4,5.5 0,0 0,11 ')
            a.prev(@click.prevent="previousSong" href="#" v-if="activeSituation > 0" title="prev")
                svg.outline(version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='9px' height='9px' viewbox='0 0 9 9' style='overflow:visible;enable-background:new 0 0 9 9;' xml:space='preserve')
                    polygon(points='0,4.5 5.4,9 5.4,6 7.2,7.5 9,9 9,0 7.2,1.5 5.4,3 5.4,0 ')
            
            a.pause(@click.prevent="pauseSong" href="#" v-if="activeSituation > 0 && isPlaying" title="pause")
                svg(version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8.4px" height="11px" viewBox="0 0 8 11" style="overflow:visible;enable-background:new 0 0 8 11;" xml:space="preserve")
                    rect( x="1" y="1" width="1" height="9")
                    rect( y="1" x="6" width="1" height="9")
            a.play(@click.prevent="playSong" href="#" v-if="activeSituation > 0 && !isPlaying" title="play")
                svg(version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='8.4px' height='11px' viewbox='0 0 8.4 11' style='overflow:visible;enable-background:new 0 0 8.4 11;' xml:space='preserve')
                    polygon(points='8.4,5.5 0,0 0,11 ')
            //- a.name(href="#" @click.prevent="() => {}" v-if="activeSituation > 0")
            //-     span {{ song.title }}
            a.next(@click.prevent="nextSong" href="#" v-if="activeSituation > 0" title="next")
                svg.outline(version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='9px' height='9px' viewbox='0 0 9 9' style='overflow:visible;enable-background:new 0 0 9 9;' xml:space='preserve')
                    polygon(points='9,4.5 3.6,0 3.6,3 1.8,1.5 0,0 0,9 1.8,7.5 3.6,6 3.6,9 ')

            a.audio(@click.prevent="muteSong" href="#" v-if="activeSituation > 0")
                svg(version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='13px' height='11px' viewbox='0 0 13 11' style='overflow:visible;enable-background:new 0 0 13 11;' xml:space='preserve')
                    rect.audio(x='12' width='1' height='11' :style="{transform:'scaleY('+freq[6]+')'}")
                    rect.audio(x='10' width='1' height='11' :style="{transform:'scaleY('+freq[5]+')'}")
                    rect.audio(x='8' width='1' height='11' :style="{transform:'scaleY('+freq[4]+')'}")
                    rect.audio(x='6' width='1' height='11' :style="{transform:'scaleY('+freq[3]+')'}")
                    rect.audio(x='4' width='1' height='11' :style="{transform:'scaleY('+freq[2]+')'}")
                    rect.audio(x='2' width='1' height='11' :style="{transform:'scaleY('+freq[1]+')'}")
                    rect.audio(width='1' height='11' :style="{transform:'scaleY('+freq[0]+')'}")
        .mobile
            svg(@click.prevent="muteSong" version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='50px' height='41.1px' viewbox='0 0 50 41.1' style='overflow:visible;enable-background:new 0 0 50 41.1;' xml:space='preserve')
                g.mute(v-if="!mute")
                    path.st0(d='M31.5,0.2C31-0.1,30.4,0,30,0.3L15.7,11.8H8.9c-1.6,0-2.9,1.3-2.9,2.9v11.8c0,1.6,1.3,2.9,2.9,2.9h6.8L30,40.8\
                    c0.3,0.2,0.6,0.3,0.9,0.3c0.2,0,0.4,0,0.6-0.1c0.5-0.2,0.8-0.8,0.8-1.3V1.5C32.4,0.9,32,0.4,31.5,0.2z')
                    path.st0(d='M39.8,10.2c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1c2.2,2.2,3.4,5.1,3.4,8.3s-1.2,6.1-3.4,8.3\
                    c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1,0.4c0.4,0,0.7-0.1,1-0.4c2.8-2.7,4.3-6.4,4.3-10.4S42.6,12.9,39.8,10.2z')
                    path.st0(d='M44,6c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.5,0,2.1c3.3,3.3,5.2,7.7,5.2,12.4s-1.8,9.1-5.2,12.4\
                    c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1,0.4c0.4,0,0.7-0.1,1-0.4c3.9-3.9,6-9,6-14.5S47.9,9.9,44,6z')
                g#unmute(v-else)
                    path.st0(d='M32.3,1.5c0-0.6-0.3-1.1-0.8-1.3C31-0.1,30.4,0,29.9,0.3l-13,10.4l15.4,15.4V1.5z')
                    path.st0(d='M40.7,38.6L2.5,0.4C1.9-0.1,1-0.1,0.4,0.4s-0.6,1.5,0,2.1l9.2,9.2H8.8c-0.9,0-1.7,0.4-2.2,1.1\
                    c-0.4,0.5-0.7,1.2-0.7,1.9v11.8c0,1.6,1.3,2.9,2.9,2.9h6.8l14.3,11.4c0.3,0.2,0.6,0.3,0.9,0.3c0.2,0,0.4-0.1,0.6-0.1\
                    c0.5-0.2,0.8-0.8,0.8-1.3v-5.3l6.3,6.3c0.3,0.3,0.7,0.4,1,0.4s0.8-0.1,1-0.4C41.3,40.1,41.3,39.2,40.7,38.6z')
                    
</template>
<script>
    export default {
        data() {
            return {
                headerAnimateHolder : null,
                lastTime : null,
                freq : [0,0,0,0,0,0,0]
            }
        },
        computed: {
            activeSituation(){
                return parseInt(this.$store.state.layout.activeSituation);
            },
            isPlaying(){
                return this.$store.state.layout.isPlaying;
            },
            lastSong(){
                return this.$store.state.layout.situations.length - 1;
            },
            song(){
                var situations = this.$store.state.layout.situations;
                return situations ? situations[this.$store.state.layout.activeSituation] : null;
            },
            mute:{
                get(){
                    return this.$store.state.layout.mute;
                },
                set(v){
                    this.$store.commit('layout/setMute',v);
                }
            }
        },
        mounted(){
            this.headerAnimate()
        },
        beforeDestroy(){
            cancelAnimationFrame(this.headerAnimateHolder);
        },
        methods: {
            letsPlay(){
                this.$nuxt.$emit("changeSituation",1);
            },
            nextSong(){
                if(this.$store.state.layout.situations){
                    var next = this.activeSituation + 1 > this.lastSong ? 1 : this.activeSituation + 1;
                    if(this.$store.state.layout.situations[next].isMetal){
                        next = next + 1 > this.lastSong ? 1 : next + 1
                    }
                    this.$nuxt.$emit("changeSituation",next);
                }
            },
            previousSong(){
                if(this.$store.state.layout.situations){
                    var next = this.activeSituation - 1 < 1 ? this.lastSong  : this.activeSituation - 1;
                    if(this.$store.state.layout.situations[next].isMetal){
                        next = next - 1 < 1 ? this.lastSong  : next - 1;
                    } 
                    this.$nuxt.$emit("changeSituation",next);
                }
            },
            pauseSong(){
                this.$nuxt.$emit("pauseSong");
            },
            playSong(){
                this.$nuxt.$emit("playSong");
            },
            muteSong(){
                this.mute = !this.mute;
                console.log(!!navigator.platform.match(/iPhone|iPod|iPad/), this.mute);

                if(!!navigator.platform.match(/iPhone|iPod|iPad/) || (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)){
                    if(this.mute){
                        console.log('PAUSE')
                        this.$nuxt.$emit("pauseSong");

                    }else{
                        console.log('PLAY')

                        this.$nuxt.$emit("playSong");

                    }
                }

            },
            headerAnimate(time){
                if(!this.lastTime) this.lastTime = parseInt(time);
                if(this.activeSituation > 0 && this.isPlaying && !this.mute){
                    if(time - this.lastTime > 100){
                        if(window.analyser){
                        var a = window.analyser.getFrequencyData();
                        // per un risultato più preciso va fatta una media delle frequenze
                        for(var i in this.freq){
                            this.freq[i] = Math.max(.2,a[12+i*6]/255);
                        }
                        this.lastTime = parseInt(time);
                        this.$forceUpdate();
                        }
                    }
                }else{
                    for(var i in this.freq){
                        if(this.freq[i] > 0) this.freq[i] -= .05;
                        this.$forceUpdate();
                    }
                }
                this.headerAnimateHolder = window.requestAnimationFrame(time => this.headerAnimate(time));
            }
        },
    }
</script>