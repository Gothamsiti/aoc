<template lang="pug">
  main#default(:class="{openMenu: menuOpen, closeMenu : menuClose, loaded : loaded, preloaderGone : preloaderGone, playing:playing, leavePage:leavePage, openModalVideo: openModalVideo, metal:isMetal}")
    preloader
    mainThree(v-if="!$nuxt.context._errored")
    goMetal
    mainHeader
    mainMenu
    nuxt
    modalVideo
    mouse
    pointer
</template>
<script>
  import mouse from '~/components/system/utils/mouse.vue';
  import pointer from '~/components/system/utils/pointer.vue';
  import mainHeader from '~/components/system/header/mainHeader';
  import mainMenu from '~/components/system/mainMenu/mainMenu';
  import mainThree from '~/components/system/mainThree/mainThree';
  import preloader from '~/components/system/preloader/preloader';
  import goMetal from '~/components/system/goMetal.vue';
  import modalVideo from '~/components/pageComponents/components/modalVideo.vue';

export default {
    data() {
      return {
        wW : 0,
        wH : 0,
        pageHeight : 0,
        animateHolder : null,
        bodyClientHeight : 0,
        counter:0,
        menuClose : false,
        touchPointStart : { 
          x : 0,
          y : 0
        }
      }
    },
    components : {
      mouse,
      pointer,
      mainHeader,
      mainThree,
      preloader,
      mainMenu,
      modalVideo,
      goMetal
    },
    computed: {
      loaded(){
        return this.$store.state.layout.loaded;
      },
      progress(){
        return this.$store.state.layout.progress;
      },
      menuOpen(){
        return this.$store.state.layout.menu;
      },
      scrollTop : {
        get(){
          return this.$store.state.scroll.top;
        },
        set(value){
          this.$store.commit("scroll/setTop",{ top: value , wH : this.wH, wW : this.wW });
        }
      },
      preloaderGone(){
        return this.$store.state.layout.preloaderGone;
      },
      playing(){
        return this.$store.state.layout.activeSituation > 0;
      },
      leavePage(){
        return this.$store.state.layout.leavePage;
      },
      openModalVideo(){
        return this.$store.state.videoModal.modalVideoOpen;
      },
      isMetal(){
        return this.$store.state.layout.isMetal;
      }
    },
    watch: {
      menuOpen(t,f){
        this.menuClose = f ? true : false;
      }
    },
    created(){
      if(process.client){
        var isTouchDevice = 'ontouchstart' in document.documentElement;
        this.$store.commit("layout/setTouch",isTouchDevice);
      }
    },
    beforeMount(){
      this.setWindowDimensions();
    },
    mounted() {
      document.body.addEventListener("mousewheel", this.handleWheel, false);
      document.body.addEventListener("DOMMouseScroll", this.handleWheel, false);
      document.body.addEventListener("wheel", this.handleWheel, false);
      document.body.addEventListener("touchstart", this.handleTouchMoveInit, false);
      document.body.addEventListener("touchmove", this.handleTouchMove, false);
      document.body.addEventListener("touchend", this.handleTouchMoveEnd, false);
      window.addEventListener("scroll", this.handleScroll);
      window.addEventListener("resize",this.handleResize);
    },
    beforeDestroy(){
      document.body.removeEventListener("mousewheel", this.handleWheel);
      document.body.removeEventListener("DOMMouseScroll",this.handleWheel);
      document.body.removeEventListener("wheel",this.handleWheel);
      document.body.removeEventListener("touchstart", this.handleTouchMoveInit);
      document.body.removeEventListener("touchmove", this.handleTouchMove);
      document.body.removeEventListener("touchend", this.handleTouchMoveEnd);
      window.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("resize",this.handleResize);
      cancelAnimationFrame(this.animateHolder);
    },
    methods : {
      setWindowDimensions(){
        this.wW = window.innerWidth;
        this.wH = window.innerHeight;
        this.bodyClientHeight = document.body.clientHeight;
        this.$store.commit("scroll/setTop",{ top: 0 , wH : this.wH, wW : this.wW });
      },
    handleWheel(e){
      if(e.deltaY){
        var newTop = this.scrollTop + e.deltaY;
        var maxScroll = this.pageHeight - this.wH;
        newTop = newTop < 0 ? 0 : newTop;
        newTop = newTop > maxScroll ? maxScroll : newTop;
        this.$store.commit("scroll/setTop",{ top: newTop, wH : this.wH, wW : this.wW, wheelX:e.deltaX, wheelY:e.deltaY });
      }
    },
    handleScroll(e){
    },
    handleResize(e){
      this.wW = window.innerWidth;
      this.wH = window.innerHeight;
      this.$store.commit("scroll/setTop",{ top: 0 , wH : this.wH, wW : this.wW });
    },
    handleTouchMoveInit(e){
      this.touchPointStart = { 
        x : e.touches[0].clientX,
        y : e.touches[0].clientY
      }
    },
    handleTouchMove(e){
      var deltaX = this.touchPointStart.x - e.touches[0].clientX;
      var deltaY = this.touchPointStart.y - e.touches[0].clientY;
      var newTop = this.scrollTop + deltaY;
      var maxScroll = this.pageHeight - this.wH;
      newTop = newTop < 0 ? 0 : newTop;
      newTop = newTop > maxScroll ? maxScroll : newTop;
      this.touchPointStart = { 
        x : e.touches[0].clientX,
        y : e.touches[0].clientY
      }
      this.$store.commit("scroll/setTop",{ top: newTop, wH : this.wH, wW : this.wW, wheelX:deltaX, wheelY:deltaY });
    },
}
    }
</script>