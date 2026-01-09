<template lang="pug">
    .modalVideo(@click="handler")
        .content(v-if="video")
            iframe(width="560" height="315" :src="'https://www.youtube.com/embed/'+video" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen)
        .close(@click="close()")
</template>
<script>
export default {
    computed:{
        video(){
            return this.$store.state.videoModal.asset;
        },
    },
    created(){
        if(!this.video){
            this.close();
        }
    },
    methods: {
        close(){
            this.$store.commit('videoModal/setModalVideoOpen', false);
            this.$store.commit('videoModal/setAsset', null);
        },
        handler(e){
            if(e.target.className == 'modalVideo'){
                this.close();
            }
        }
    }
}
</script>
