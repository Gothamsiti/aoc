<template lang="pug">
    .form(v-if="form" :class="{visible:visible}")
        form
            .fieldset(:class="{'disabled': disabled}")
                formfield(v-for="item in form.fields.fields" :key="'field_'+item.name" :blok="item" :ind="item.name")
                .action
                    a.cta(type="submit" :disabled="disabled" @click.prevent="submit" ref="submitBtn" @mouseover="$nuxt.$emit('elementOnHover','halo')" @mouseout="$nuxt.$emit('elementOnOut','halo')")
                        span {{ $__('submit') }}
            div.messages(v-if="success || error")
                h4.error(v-if="error") {{form.fields.errorMessage}}
                h4.success(v-if="success") {{form.fields.thankyouMessage}}

</template>

<script>
import formfield from '~/components/system/gothamForm/formfield.vue';
export default {
    components: {
        formfield
    },
    props : [
        'blok',
    ],
    data() {
        return {
            success : false,
            error: false,
            disabled : false,
            form: null,

            animationHolder:null,
            offsetTop : 0,
            visible: false
        }
    },
    methods: {
        async submit(){
            this.$nuxt.$emit("evalField");
            if(this.evalErrors()){
                this.disabled = true;
                this.$axios.post('/api/contacts', {
                    form: this.parseForm(),
                })
                .then(res => {
                    this.success = true;
                    this.error = false;
                    this.disabled = false;
                    this.$nuxt.$emit('clearValue');
                }).catch(err => {
                    this.error = true;
                    this.success = false;
                    this.disabled = false;
                })
            }else{
                this.$nextTick(() => {
                    if(document.querySelectorAll('input.error').length > 0){
                        document.querySelectorAll('input.error')[0].focus();
                    }
                });
            }
        },
        evalErrors(){
            var errors = 0;
            for(var k in this.form.fields.fields){
                var f = this.form.fields.fields[k];
                if(f.error){
                    errors ++;
                }
            }
            return errors == 0;
        },
        parseForm(){
            var submitFields = {}
            var attachments = {}
            for(var i = 0; i < this.form.fields.fields.length > 0; i++){
                if(this.form.fields.fields[i].name){
                    if(this.form.fields.fields[i].type == 'file'){
                        attachments[this.form.fields.fields[i].name] = {name: this.form.fields.fields[i].insertedFilename, value: this.form.fields.fields[i].value, type:this.form.fields.fields[i].insertedFileType }
                    } else {
                        submitFields[this.form.fields.fields[i].name] = this.form.fields.fields[i].value;
                    }
                }
            }
            var submitForm = JSON.parse(JSON.stringify(this.form.fields));
            submitForm.fields = submitFields;
            submitForm.attachments = attachments;

            submitForm.to = this.$route.params.slug;

            return submitForm;
        },
        initPositions(){
            if(this.$el) this.offsetTop = this.$el.offsetTop + this.$el.clientHeight/4;
        },
        animation(time){
            if(!this.offsetTop){
                this.initPositions();
            }
            this.visible = this.offsetTop < this.scrolTop; 
            this.animationHolder = requestAnimationFrame(time => this.animation(time));
        }
    },
    computed:{
        scrolTop(){
            return this.$store.state.scroll.top + this.$store.state.scroll.wH;
        }
    },
    created(){
        this.form = this.blok;
        this.$nuxt.$on("changeTop", this.initPositions);
    },
    mounted() {
        this.initPositions();
        this.animation();
    },
    beforeDestroy(){
        cancelAnimationFrame(this.animationHolder);
        this.form = null;
    }
}
</script>
