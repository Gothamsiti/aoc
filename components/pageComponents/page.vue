<template lang="pug">
    div.page
        breadcrumbs(:title="story.content.title")
        component(v-for="(component,i) in story.content.body" v-if="story" :blok="component" :key="component._uid" :is="component.component" :stories="storiesComponents.includes(component.component) ? stories : []" :class="{'first': i == 0}")
        relatedItems(v-if="['services','solutions'].includes($route.params.folder) && $route.params.slug")
</template>

<script>

import megaBigText from '~/components/pageComponents/components/megaBigText.vue';
import introText from '~/components/pageComponents/components/introText.vue';
import bigText from '~/components/pageComponents/components/bigText.vue';
import listDownload from '~/components/pageComponents/components/listDownload.vue';
import completeNewsList from '~/components/pageComponents/components/completeNewsList.vue';
import completeServiceList from '~/components/pageComponents/components/completeServiceList.vue';
import completeSolutionsList from '~/components/pageComponents/components/completeSolutionsList.vue';
import breadcrumbs from '~/components/pageComponents/components/breadcrumbs.vue';
import editorText from '~/components/pageComponents/components/editorText.vue';
import images from '~/components/pageComponents/components/images.vue';
import relatedItems from '~/components/pageComponents/components/relatedItems.vue';

export default {
    props:['story', 'stories'],
    components:{
        megaBigText,
        introText,
        bigText,
        listDownload,
        completeNewsList,
        completeServiceList,
        completeSolutionsList,
        breadcrumbs,
        editorText,
        images,
        relatedItems
    },
    data(){
        return{
            storiesComponents : [
                'completeNewsList',
                'completeServiceList',
                'completeSolutionsList'
            ]
        }
    },
}
</script>
