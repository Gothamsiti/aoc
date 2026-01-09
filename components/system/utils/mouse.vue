<template>
    <span></span>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    data(){
        return{
            windowHalfX :0,
            windowHalfY : 0,
            mouse:{
                x : 0,
                y : 0,
                realx : 0,
                realy : 0,
            }
        }
    },
    mounted(){
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.mouse = {
            x : window.innerWidth / 2,
            y : window.innerHeight / 2,
            realx : window.innerWidth / 2,
            realy : window.innerHeight / 2,
        }
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
        this.updateMouse();
        this.$nuxt.$on('emitMouseMove',this.emitMouseMove);
    },
    beforeDestroy(){
        document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.removeEventListener( 'touchstart', this.onDocumentTouchStart, false );
        document.removeEventListener( 'touchmove', this.onDocumentTouchMove, false );
    },
    methods : {
        onDocumentTouchStart(e){
            if ( e.touches.length === 1 ) {
                this.mouse.x = e.touches[ 0 ].pageX - this.windowHalfX;
                this.mouse.y = e.touches[ 0 ].pageY - this.windowHalfY;
                this.mouse.realx = e.touches[ 0 ].pageX;
                this.mouse.realy = e.touches[ 0 ].pageY;
                this.updateMouse();
            }
        },
        onDocumentTouchMove(e){
            if ( e.touches.length === 1 ) {
                this.mouse.x = e.touches[ 0 ].pageX - this.windowHalfX;
                this.mouse.y = e.touches[ 0 ].pageY - this.windowHalfY;
                this.mouse.realx = e.touches[ 0 ].pageX;
                this.mouse.realy = e.touches[ 0 ].pageY;
                this.updateMouse();
            }
        },
        onDocumentMouseMove(e){
            var scrollTop = this.$store.state.scroll.top;
            this.mouse.x = parseInt(e.clientX - this.windowHalfX);
            this.mouse.y = parseInt(e.clientY - this.windowHalfY);
            this.mouse.realx = parseInt(e.clientX);
            this.mouse.realy = parseInt(e.clientY);
            this.updateMouse();
        },
        emitMouseMove(e){
            var scrollTop = this.$store.state.scroll.top;
            this.mouse.x = parseInt(e.clientX - this.windowHalfX);
            this.mouse.y = parseInt(e.clientY - this.windowHalfY);
            this.mouse.realx = parseInt(e.clientX);
            this.mouse.realy = parseInt(e.clientY);
            this.updateMouse();
        },
        updateMouse(){
            this.$store.commit('mouse/set',this.mouse);
        }
    }
}
</script>

