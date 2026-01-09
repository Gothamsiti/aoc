<template lang="pug">
    .workWithUs
        megaBigText(:blok="parseTitle(story.content.title)")
        bigText(:blok="{text:story.content.subtitle}")
        introText(:blok="{text:story.content.introTextLeft, right:story.content.introTextRight}")
        bigText(:blok="{text:story.content.text}")
        jobOffers(:blok="story.content.jobOffers" :title="story.content.jobOffersTitle")
        h3.formTitle {{$__('workWithUsFormTitle')}}
        gothamForm(:blok="story.content.form")
</template>

<script>
import megaBigText from '~/components/pageComponents/components/megaBigText.vue';
import bigText from '~/components/pageComponents/components/bigText.vue';
import introText from '~/components/pageComponents/components/introText.vue';
import jobOffers from '~/components/pageComponents/components/jobOffers.vue';
import gothamForm from '~/components/system/gothamForm/sectionForm.vue';

export default {
    props:['story', 'stories'],
    components:{
        megaBigText,
        bigText,
        introText,
        jobOffers,
        gothamForm
    },
    created(){
        var options = [];
        for(var i in this.story.content.jobOffers){
            options.push({label : this.story.content.jobOffers[i].title, value: this.story.content.jobOffers[i].title});
        }
        for(var i in this.story.content.form.fields.fields){
            if(this.story.content.form.fields.fields[i].name == 'position'){
                this.story.content.form.fields.fields[i].select = options;
                if(options.length == 0){
                    this.story.content.form.fields.fields[i].required = false;
                }
            }
        }
    },
    methods: {
        parseTitle(t){
            var res = [];
            t = t.split('|');
            for(var i in t){
                res.push({text: t[i]});
            }
            return {phrase: res};
        }
    },
}
</script>
