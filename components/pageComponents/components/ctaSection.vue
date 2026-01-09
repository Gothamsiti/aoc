<template lang="pug">
    .ctaSection
        ThreeDText(:text="blok.text")
        cta(:blok="blok.link[0]")
</template>
<script>
import ThreeDText from '~/components/pageComponents/components/ThreeDText.vue';
import cta from '~/components/system/utils/cta.vue';
export default {
    props:['blok'],
    components : {
        ThreeDText,
        cta
    }
}
</script>