<template>
    <div id="pointer" v-if="!isTouch">
        <pointerelement v-for="i in max" :key="i" class="pointer" :class="classes" />
    </div>
</template>
<script>
import pointerelement from '~/components/system/utils/pointerelement.vue';
import { mapMutations } from 'vuex';
import TWEEN from '@tweenjs/tween.js';

export default {
    data(){
        return{
            storedmouse : {
                x : 0,
                y : 0
            },
            app : {},
            max : 1,
            lerp : .4,
            pointers : [],
            elements : '',
            isTouch : false,
            classes : []
        }
    },
    components : {
        pointerelement
    },
    mounted(){
        if(!('ontouchstart' in window)){
            this.buildPointers();
        }else{
            this.isTouch = true;
        }
            this.animate();
            this.$nuxt.$on('elementOnHover',this.elementOnHover);
            this.$nuxt.$on('elementOnOut',this.elementOnOut);
            this.$nuxt.$on('clearPointer',(str) => { this.classes.splice(0,this.classes.length)});
    },
    created(){
    },
    methods : {
        buildPointers(){
            for(var i in this.$children){
                var child = this.$children[i];
                child.steps = 10 + 2 * i;
                child.opacity = 1 - this.lerp * i;
                child.zIndex = 100 - i;
            }
        },
        animate(time) {
            requestAnimationFrame(time => this.animate(time));
            this.updatePosition();
            TWEEN.update(time);
        },
        updatePosition(){
            for(var i in this.$children){
                var p = this.$children[i];
                p.delta.x = this.$store.state.mouse.realx - p.position.x;
                p.delta.y = this.$store.state.mouse.realy - p.position.y;
                this.storedmouse.x = this.$store.state.mouse.x;
                this.storedmouse.y = this.$store.state.mouse.y;
                p.position.x += p.delta.x / p.steps;
                p.position.y += p.delta.y / p.steps;
                this.$store.commit("pointer/set",{ x : p.position.x, y : p.position.y});
            }
        },
        elementOnHover(c){
            this.classes.push(c);
        },
        elementOnOut(c){
            this.classes.splice(this.classes.indexOf(c),1);
        },
    }
}
</script>
