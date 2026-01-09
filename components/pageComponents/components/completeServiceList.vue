<template lang="pug">
    .completeServiceList
        serviceItemPreview(v-for="item in stories" :key="item.uuid" :blok="item")
</template>

<script>
import serviceItemPreview from '~/components/pageComponents/components/serviceItemPreview.vue';
export default {
    props: ['blok','stories'],
    components:{
        serviceItemPreview
    }
}
</script>