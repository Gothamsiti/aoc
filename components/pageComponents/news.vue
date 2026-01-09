<template lang="pug">
    #news 
        breadcrumbs(:title="story.content.title")
        .newsBody
            h3.light.date {{$formatDate(story.published_at, 'DD/MM/YYYY')}}
            h3 {{story.content.title}}
            .text(v-html="$storyapi.richTextResolver.render(story.content.text)")
            .gallery 
                miniSlider(:images="story.content.gallery")
            .attachments
                listDownload(:blok="{files:story.content.attachments}")
                listVideo(:blok="story.content.videos")
</template>

<script>
import listDownload from '~/components/pageComponents/components/listDownload.vue';
import listVideo from '~/components/pageComponents/components/listVideo.vue';
import miniSlider from '~/components/pageComponents/components/miniSlider.vue';
import breadcrumbs from '~/components/pageComponents/components/breadcrumbs.vue';
export default {
    props:['story'],
    components:{
        listDownload,
        listVideo,
        miniSlider,
        breadcrumbs
    },
}
</script>
