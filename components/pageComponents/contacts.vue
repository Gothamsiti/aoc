<template lang="pug">
    #contacts
        megaBigText(:blok="{phrase:story.content.introText}")
        contactAddresses(:blok="story.content.contacts")
        images(:blok="{images:[{image:story.content.image,width: 17,height: 5,marginTop:2}]}")
        gothamForm(:blok="story.content.form")
</template>

<script>
import megaBigText from '~/components/pageComponents/components/megaBigText.vue';
import contactAddresses from '~/components/pageComponents/components/contactAddresses.vue';
import images from '~/components/pageComponents/components/images.vue';
import gothamForm from '~/components/system/gothamForm/sectionForm.vue';


export default {
    props:['story','stories'],
    components:{
        megaBigText,
        contactAddresses,
        images,
        gothamForm
    }
}
</script>
