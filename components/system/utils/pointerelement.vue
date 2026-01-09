<template lang="pug">
    div(:style="style()" :data-text="text" :class="{metal:isMetal}")
        div(:style="'background-color:'+color+';border-color:'+bordercolor+';'")
        div.customCursor
            svg(:style="swing()" version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='141.1px' height='200.1px' viewbox='0 0 141.1 200.1' style='overflow:visible;enable-background:new 0 0 141.1 200.1;' xml:space='preserve')
                path(d='M54.4,83.9c0.1,0,0.1,0,0.2,0c1,0,1.9-0.8,2-1.8c0.3-3.5,3-9.8,5-11.8c0.8-0.8,0.8-2,0-2.8\
                c-0.8-0.8-2-0.8-2.8,0c-2.8,2.9-5.7,10.3-6.1,14.2C52.5,82.8,53.3,83.8,54.4,83.9z')
                path(d='M86.7,21.1c1.7,0,3-0.5,3-1.2c0-0.7-1.4-1.2-3-1.2c-1.7,0-3,0.5-3,1.2C83.7,20.5,85,21.1,86.7,21.1z')
                path(d='M86.7,36.9c1.7,0,3-0.5,3-1.2s-1.4-1.2-3-1.2c-1.7,0-3,0.5-3,1.2C83.7,36.3,85,36.9,86.7,36.9z')
                path(d='M45.5,40.4c-1.7,0-3,0.5-3,1.2c0,0.7,1.4,1.2,3,1.2c1.7,0,3-0.5,3-1.2C48.5,40.9,47.2,40.4,45.5,40.4z')
                path(d='M45.5,56.2c-1.7,0-3,0.5-3,1.2s1.4,1.2,3,1.2c1.7,0,3-0.5,3-1.2C48.5,56.8,47.2,56.2,45.5,56.2z')
                path(d='M102.4,66.7V55c0-4.2-2.9-7.8-6.9-8.7V9c0-4.9-4-9-8.8-9c-4.9,0-8.8,4-8.8,9v19.7c-1.4-0.9-3.1-1.5-4.9-1.5\
                c-3.9,0-7.2,2.6-8.4,6.1c-1.5-1.1-3.3-1.8-5.3-1.8c-1.8,0-3.5,0.5-4.9,1.5v-3.1c0-4.9-4-9-8.8-9s-8.8,4-8.8,9v37.8\
                C14,80.1,0,103.7,0,129.6c0,38.9,31.6,70.5,70.5,70.5c38.9,0,70.5-31.6,70.5-70.5C141.1,102.8,126.3,78.8,102.4,66.7z M81.8,9\
                c0-2.8,2.2-5,4.9-5c2.7,0,4.9,2.2,4.9,5V46h-9.8c0,0,0-0.1,0-0.1L81.8,9L81.8,9z M68.1,40.5v-0.1v-4.2c0-2.8,2.2-5,4.9-5\
                c2.7,0,4.9,2.2,4.9,5v9.8c0,0,0,0.1,0,0.1h-8c-0.6,0-1.2,0.1-1.7,0.3V40.5z M54.3,40.5v-0.1c0-2.7,2.2-4.9,4.9-4.9s4.9,2.2,4.9,4.9\
                v0.1v14.6c0,2.7-2.2,4.9-4.9,4.9s-4.9-2.2-4.9-4.9V40.5z M40.6,29.9c0-2.8,2.2-5,4.9-5s4.9,2.2,4.9,5v10.4v0.1v14.6\
                c0,4.9,4,8.8,8.8,8.8c3.3,0,6.1-1.8,7.6-4.4c1.6,2,3.8,3.4,6.4,4.1c-5.5,3.8-9.1,10.2-9.1,17.4c0,1.1,0.9,2,2,2s2-0.9,2-2\
                c0-9.4,7.5-17.1,16.8-17.1c1.1,0,2-0.9,2-2s-0.9-2-2-2h-8.7c-4.4,0-8-3.7-8-8.2c0-1,0.8-1.8,1.7-1.8h23.7c2.7,0,4.9,2.2,4.9,5v12.8\
                c0,16.2-13,29.4-28.9,29.4S40.6,84,40.6,67.8V29.9z M70.5,196.1C33.8,196.1,4,166.3,4,129.6c0-23.8,12.5-45.5,33-57.4\
                c2.1,16.3,15.9,29,32.6,29c17,0,31.1-13.2,32.7-30.1c21.5,11.7,34.8,33.8,34.8,58.5C137.1,166.3,107.2,196.1,70.5,196.1z')

</template>
<script>
    export default {
        data(){
            return{
                position : { x : 0 , y : 0},
                delta : { x :0 , y : 0 },
                steps : 0,
                opacity : 0,
                zIndex : 0,
                rotation : 0,
                text : ' ',
                color : '#4cbbd7',
                bordercolor : '#4cbbd7',
                style(){
                    var style = 'top: ' +this.position.x+ ' px"; ';
                    style += 'left: ' +this.position.y+ ' px; ';
                    style += 'opacity: ' +this.opacity+ '; ';
                    style += 'z-index: ' +this.zIndex+ '; ';
                    return style;
                },
                swing(){
                    var style = 'transform: rotate('+this.rotation+'deg)';
                    return style;
                }
            }
        },
        computed:{
            isMetal(){
                return this.$store.state.layout.isMetal;
            },
            positionX(){
                return this.position.x;
            }
        },
        // watch:{
        //     positionX(t,f){
        //         var delta = parseInt(t - f);
        //         this.rotation = delta * 2;
        //     }
        // },
        methods: {
            animate(){
                requestAnimationFrame(time => this.animate(time));
                this.$el.style.left = this.position.x + "px";
                this.$el.style.top = this.position.y + "px";

                var deltaDeg = parseInt(this.$store.state.mouse.realx - this.position.x) / 6;
                // console.log(this.$store.state.mouse.realx, deltaDeg);
                this.rotation = deltaDeg;


            }
        },
        mounted() {
            this.animate();
        },
    }
</script>