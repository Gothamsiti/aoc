<template lang="pug">
    #mainThree
</template>
<script>
  import * as THREE from 'three'; 
  import shaderFrag from '!raw-loader!~/components/shaders/shader.frag';
  import shaderVert from '!raw-loader!~/components/shaders/shader.vert';
    
  import shaderFragIOS from '!raw-loader!~/components/shaders/shaderIOS.frag';
  import shaderVertIOS from '!raw-loader!~/components/shaders/shaderIOS.vert';
  import { Easing, Tween, autoPlay } from 'es6-tween';
export default {
    data() {
        return {
            targetMouseX : 0,
            targetMouseY : 0,
            scene : null,
            camera : null,
            cameraHeight: null,
            cameraWidth: null,
            renderer : null,
            playingAudio: false,
            mediaElement: null,
            listener: null,
            audio: null,
            analyser: null,
            fftSize: 128,
            uniforms: null,
            colorA: {},
            colorB : {},
            initAudioDone: false,
            // changingSituation: false,
            preloaderGoneAndWaited : false,
            animateMetodsToDo : [],
            topOffset: .5,
            animateHolder: null,
            topOffsetToUniform: .5,
            ThreeAudio : null
            // count: 0
        }
    },
    computed: {
        wW(){ return this.$store.state.scroll.wW },
        wH(){ return this.$store.state.scroll.wH },
        isMobile(){ return this.wW < 768},
        scrollTop(){ return this.$store.state.scroll.top },
        mouse(){ return this.$store.state.mouse },
        isMetal(){return this.$store.state.layout.isMetal},
        preloaderHasToPlay(){return this.$store.state.layout.preloaderHasToPlay},
        menuItems(){ return this.$store.state.layout.menuItems},
        situations:{ 
            get(){
                return this.$store.state.layout.situations;
            },
            set(v){
                this.$store.commit("layout/setSituations");
            }
        },
        changingSituation : {
            get(){
                return this.$store.state.layout.changingSituation;
            },
            set(v){
                this.$store.commit("layout/setchangingSituation",v);
            }
        },
        activeSituation : {
            get(){
                return this.$store.state.layout.activeSituation;
            },
            set(v){
                this.$store.commit("layout/setActiveSituation",v);
            }
        },
        preloaderGone(){
            return this.$store.state.layout.preloaderGone;
        },
        isHP(){
            return this.$store.state.layout.isHP;
        },
        isPlaying : {
            get(){
                return this.$store.state.layout.isPlaying;
            },
            set(v){
                this.$store.commit("layout/setIsPlaying",v);
            }
        },
        isPaused : {
            get(){
                return this.$store.state.layout.isPaused;
            },
            set(v){
                this.$store.commit("layout/setIsPaused",v);
            }
        },
        mute(){
            return this.$store.state.layout.mute;
        }
    },
    watch: {
        async menuItems(t,f){
            var situations = await this.getSituations(t);
            this.$store.commit('layout/storeSituations',situations); 
        },
        preloaderGone(t,f){
            if(t){
                setTimeout(() => {
                    this.preloaderGoneAndWaited = true;
                    this.$nuxt.$emit('metalCanGo',true);


                    var folder = this.$route.params.folder+'/';
                    var slug = this.$route.params.slug ? this.$route.params.slug : null;
                    var fullPath = folder + (slug ? slug : '');

                    var found = false;
                    var indexHP = 1;
                    for(var o in this.situations){
                        if(this.situations[o].isHomepage) indexHP = o;
                        if(this.situations[o].folders){
                            for(var i in this.situations[o].folders){
                                if(folder == this.situations[o].folders[i]){
                                    this.changeSituation(parseInt(o)); 
                                    found = true;
                                    break;
                                } 
                                if(!found && fullPath == this.situations[o].folders[i]){
                                    this.changeSituation(parseInt(o));
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                    if(!found) this.changeSituation(indexHP);
                }, 2000);
            }
        },
        isHP(t,f){
            new Tween(this).to({ topOffset : t ? .5 : 1 },800).easing(Easing.Back.InOut).start();
        },
        isMetal(t,f){
            if(t){
                for(var i in this.situations){
                    if(this.situations[i].isMetal){
                        this.changeSituation(i,true);
                        break;
                    }
                }
            }else{
                var folder = this.$route.params.folder+'/';
                var slug = this.$route.params.slug ? this.$route.params.slug : null;
                var fullPath = folder + (slug ? slug : '');
                var found = false;
                var indexHP = 1;
                for(var o in this.situations){
                    if(this.situations[o].isHomepage) indexHP = o;
                    if(this.situations[o].folders){
                        for(var i in this.situations[o].folders){
                            if(folder == this.situations[o].folders[i]){
                                this.changeSituation(parseInt(o)); 
                                found = true;
                                break;
                            } 
                            if(!found && fullPath == this.situations[o].folders[i]){
                                this.changeSituation(parseInt(o));
                                found = true;
                                break;
                            }
                        }
                    }
                }
                if(!found) this.changeSituation(indexHP);
                this.changeSituation(indexHP);
            }
        },
        wW(){
            this.resizeRenderer();
        },
        wH(){
            this.resizeRenderer();
        },
        mute(t,f){
            window.mediaElement.muted = t;
            // if(t){
            //     window.mediaElement.volume = 0;
            // }else{
            //     window.mediaElement.volume = 1;
            // }
        }
    },
    beforeDestroy(){
        cancelAnimationFrame(this.animateHolder);
    },
    created() {
        this.$store.commit("layout/setLoaded",false);
        this.$nuxt.$on("changeSituation",i => {
            this.changeSituation(i);
        })
        this.$nuxt.$on("pauseSong",() => {
            this.pauseSong();
        })
        this.$nuxt.$on("playSong",() => {
            this.playSong();
        })
    },
    mounted() {
        this.topOffset = this.isHP ? .5 : 1;
        autoPlay(true);
        this.animate();
        this.animateMetodsToDo.push(["init",Date.now()+20]);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if(window.mediaElement) window.mediaElement.pause();
            }else {
                if(this.isPlaying){
                    if(window.mediaElement) window.mediaElement.play();
                }
            }
        });
    },
    methods: {
        async getSituations(menuItems){
            var endpoint = 'cdn/stories';
            var params = {
                version: this.$nuxt.context.isDev ? 'draft' : 'published',
                starts_with: 'system/songs/'
            }
            var songs = await this.$storyapi.get(endpoint, params).then(res => {
                return res.data.stories;
            }).catch(err => {
                console.log(err);
            })

            var arr = [{a: 0x777777, b: 0x888888}];
            for(var i in songs){
                var obj = {}
                obj.a = songs[i].content.a.color;
                obj.b = songs[i].content.b.color;
                obj.title = songs[i].content.title;
                obj.isMetal = songs[i].content.isMetal;
                obj.isHomepage = songs[i].content.isHomepage;
                obj.minDecibels = songs[i].content.minDecibels ? songs[i].content.minDecibels : null;
                obj.maxDecibels = songs[i].content.maxDecibels ? songs[i].content.maxDecibels : null;
                obj.smoothingTimeConstant = songs[i].content.smoothingTimeConstant ? songs[i].content.smoothingTimeConstant : null;
                obj.audio = songs[i].content.audio;
                obj.folders = [];
                for(var o in menuItems){
                    if(songs[i].uuid == menuItems[o].song){
                        obj.folders.push(this.$__url(menuItems[o].url.cached_url).substring(4));
                    }
                }
                arr.push(obj);
            }
            return arr;
        },
        init(){
            for(var i in this.situations){
                var s = this.situations[i];
                s.colorA = new THREE.Color(s.a);
                s.colorA = new THREE.Vector3(s.colorA.r,s.colorA.g,s.colorA.b);

                s.colorB = new THREE.Color(s.b);
                s.colorB = new THREE.Vector3(s.colorB.r,s.colorB.g,s.colorB.b); 
            }
            this.animateMetodsToDo.push(["initThree",Date.now()+20]);
        },
        initThree(){
            this.animateMetodsToDo.push(["initScene",Date.now()+20]);
            this.animateMetodsToDo.push(["addLights",Date.now()+22]);
            this.animateMetodsToDo.push(["initPlane",Date.now()+24]);
            // this.addHelper();
        },
        initScene(){
            var aspectRatio = (this.wW / 2) / this.wH;
            this.cameraHeight = 2;
            this.cameraWidth = this.cameraHeight * aspectRatio;

            this.scene = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera( - this.cameraWidth, this.cameraWidth, this.cameraHeight, -this.cameraHeight, 1, 1000 );
            this.camera.position.z = 10;
            for(var i in this.situations){
                if(this.situations[i].listener){
                    this.camera.add( this.situations[i].listener );
                }
            }
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setSize( this.wW, this.wH );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.$el.appendChild( this.renderer.domElement );
        },
        setEndLoad(){
            var loadedTime = new Date() - window.initedApplicationTime;
            var minLoadedTime = 4000;
            var loadedTimeDiff = minLoadedTime - loadedTime;
            if(this.situations){
                if(loadedTimeDiff > 0 ){
                    this.animateMetodsToDo.push([() => { this.$store.commit("layout/setLoaded",true); },Date.now()+loadedTimeDiff]);
                }else{
                    this.animateMetodsToDo.push([() => { this.$store.commit("layout/setLoaded",true); },Date.now()+100]);
                }
            }
        },
        addHelper(){
            var axesHelper = new THREE.AxesHelper( 5 );
            this.scene.add( axesHelper );

            var helper = new THREE.CameraHelper( this.camera );
            this.scene.add( helper );
        
        },
        addLights(){
            var light = new THREE.AmbientLight( 0x404040 ); // soft white light
            this.scene.add( light );
        },
        initPlane(){
            var geometry = new THREE.PlaneBufferGeometry(this.cameraWidth * 2, this.cameraHeight * 2);

            var colorA = new THREE.Vector3(this.situations[this.activeSituation].colorA.x,this.situations[this.activeSituation].colorA.y,this.situations[this.activeSituation].colorA.z);
            var colorB = new THREE.Vector3(this.situations[this.activeSituation].colorB.x,this.situations[this.activeSituation].colorB.y,this.situations[this.activeSituation].colorB.z);
            this.uniforms = {
                u_resolution : {value : new THREE.Vector2( this.wW, this.wH ), type : 'v2'},
                u_mouse : {value : new THREE.Vector2( this.wW / 2, this.wH / 2 ), type : 'v2'},
                uTime : {value: 0., type:'f'},
                u_audioFreq: {value: null},
                tDiffuse: {value: null},
                colorA: {value : colorA, type : 'v3'},
                colorB: {value : colorB, type : 'v3'},
                topOffset: {value : parseFloat(this.topOffset) ,type : 'f'},
                metal: { value :this.isMetal, type: 'b'},
                isMobile: {value: this.isMobile, type: 'b'}
            }
            this.targetMouseX = this.wW / 2;
            this.targetMouseY = this.wH / 2;

            const material = new THREE.ShaderMaterial({
                vertexShader: this.$IOS() ? shaderVertIOS : shaderVert,
                fragmentShader: this.$IOS() ? shaderFragIOS : shaderFrag,
                uniforms: this.uniforms
            });
            var plane = new THREE.Mesh( geometry, material );
            this.scene.add( plane );
            this.animateMetodsToDo.push(["setEndLoad",Date.now()+20]);
        },
        animate(time){
            if(this.situations){
                if(this.isHP){
                    this.topOffset = .5 + .5 * Math.min(this.scrollTop / (this.wH/2),1);
                }
                if(this.uniforms){
                    this.uniforms.uTime.value = time / 1000;

                    var topOffsetToUniformDelta = this.topOffsetToUniform - this.topOffset;
                    this.topOffsetToUniform -= topOffsetToUniformDelta / 6;
                    this.uniforms.topOffset.value = this.topOffsetToUniform;
                    if(this.preloaderGoneAndWaited){
                        var deltaX = this.targetMouseX - this.mouse.realx;
                        var deltaY = this.targetMouseY - this.mouse.realy;
                        this.targetMouseX = this.targetMouseX - deltaX/20;
                        this.targetMouseY = this.targetMouseY - deltaY/20;
                        this.uniforms.u_mouse.value = new THREE.Vector2( this.targetMouseX, this.targetMouseY );
                        this.uniforms.u_mouse.value.needsUpdate = true;
                    }
                    this.uniforms.u_resolution.value = new THREE.Vector2( this.wW, this.wH );
                    this.uniforms.colorA.value = new THREE.Vector3(this.colorA.x,this.colorA.y,this.colorA.z);
                    this.uniforms.colorA.value.needsUpdate = true;
                    this.uniforms.colorB.value = new THREE.Vector3(this.colorB.x,this.colorB.y,this.colorB.z);
                    this.uniforms.colorB.value.needsUpdate = true;
                    this.uniforms.isMobile.value = this.isMobile;
                    if(this.activeSituation > 0 && this.preloaderGoneAndWaited){
                        window.analyser.getFrequencyData();
                        this.uniforms.u_audioFreq.value = new THREE.DataTexture(window.analyser.data, this.cameraWidth * 2, this.cameraHeight * 2, THREE.LuminanceFormat );
                        this.uniforms.u_audioFreq.value.needsUpdate = true;
                    }else{
                        this.uniforms.u_audioFreq.value = null;
                    }
                    this.uniforms.metal.value = this.isMetal;
                }

                if(this.renderer && this.preloaderGone) this.renderer.render(this.scene,this.camera);
                this.evalAnimateToDo();
            }

            this.animateHolder = requestAnimationFrame(this.animate);
        },
        initAudio(i){
            var s = this.situations[i];

            var url = s.audio;
            if(this.$route.lang) url = '../' + url;
            if(this.$route.folder) url = '../' + url;
            if(this.$route.slug) url = '../' + url;
            if(this.$route.subslug) url = '../' + url;

            window.mediaElement.pause();
            window.mediaElement.src = url;
            window.analyser.analyser.maxDecibels = s.maxDecibels ? s.maxDecibels : this.$store.state.layout.defaultMaxDecibels;
            window.analyser.analyser.minDecibels = s.minDecibels ? s.minDecibels : this.$store.state.layout.defaultMinDecibels;
            window.analyser.analyser.smoothingTimeConstant = s.smoothingTimeConstant ? s.smoothingTimeConstant : this.$store.state.layout.defaultSmoothingTimeConstant;
        },
        changeSituation(i,fast){
            if(!this.changingSituation){
                this.changingSituation = true;
                if(i == this.activeSituation){
                    this.situationOut(i,0,fast);
                }else{
                    this.situationOut(this.activeSituation,i,fast);
                }
            }
        },
        situationOut(i,next,fast){
            var totalTime = fast ? 10 : 1000;
            var fromC = {
                Ax: this.situations[i].colorA.x,
                Ay: this.situations[i].colorA.y,
                Az: this.situations[i].colorA.z,
                Bx: this.situations[i].colorB.x,
                By: this.situations[i].colorB.y,
                Bz: this.situations[i].colorB.z,
            }
            var toC = {
                Ax: this.situations[next].colorA.x,
                Ay: this.situations[next].colorA.y,
                Az: this.situations[next].colorA.z,
                Bx: this.situations[next].colorB.x,
                By: this.situations[next].colorB.y,
                Bz: this.situations[next].colorB.z,
            }
            new Tween(fromC)
                .to(toC,totalTime)
                .on('update',(o) => {
                    this.colorA.x = o.Ax;
                    this.colorA.y = o.Ay;
                    this.colorA.z = o.Az;
                    this.colorB.x = o.Bx;
                    this.colorB.y = o.By;
                    this.colorB.z = o.Bz;
                })
                .on('complete', () => {
                    this.activeSituation = next;
                    this.changingSituation = false;
                })
                .start();


            if(i > 0){
                new Tween({v: 1})
                    .to({v: 0},totalTime * (next == 0 ? 1 : .5))
                    .on('update', (o) => {
                        window.mediaElement.volume = this.mute ? 0 : o.v;
                    })
                    .on('complete', () => {
                        this.activeSituation = this.activeSituation == next ? this.activeSituation : next;
                        window.mediaElement.pause();
                        window.mediaElement.currentTime = 0;
                        this.isPlaying = false;
                    })
                    .start();
            }
            if(next > 0){
                new Tween({v: 0})
                    .to({v: 1},totalTime * (i == 0 ? 1 : .5))
                    .delay(totalTime * (i == 0 ? 0 : .5))
                    .on('start', (o) => {
                        this.initAudio(next);
                        this.activeSituation = this.activeSituation == next ? this.activeSituation : next;
                        if(!this.isPaused){
                            window.mediaElement.play();
                            this.isPlaying = true;
                        }
                    })
                    .on('update', (o) => {
                        window.mediaElement.volume = this.mute ? 0 : o.v;
                    })
                    .start();
            }
        },
        pauseSong(){
            window.mediaElement.pause();
            this.isPlaying = false;
            this.isPaused = true;
        },
        playSong(){
            window.mediaElement.play();
            this.isPlaying = true;
            this.isPaused = false;

        },
        evalAnimateToDo(){
            if(this.animateMetodsToDo.length > 0){
                for(var i in this.animateMetodsToDo){
                    if(this.animateMetodsToDo[i][1] < Date.now()){
                        if(this[this.animateMetodsToDo[i][0]]){
                            this[this.animateMetodsToDo[i][0]]();
                        }
                        if(typeof this.animateMetodsToDo[i][0] == 'function'){
                            this.animateMetodsToDo[i][0]();
                        }
                        this.animateMetodsToDo.splice(i,1);
                    }
                    break;
                }
            }
        },
        resizeRenderer(){
            if(this.camera && this.renderer){
                this.camera.aspect = this.wW / this.wH;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.wW, this.wH);
            }
        }
    },
}
</script>