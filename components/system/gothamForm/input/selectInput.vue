<template lang="pug">
    div
        label(v-if="blok.label" :for="blok.name" v-html="evalText(blok.label)")
        select(:id="blok.name" v-on:change="setSelectValue" v-model="value")
            option(v-for="(option,index) in blok.options" :key="blok.name + '_'+ ind + '_' + index" :value="option.value" v-html="evalText(option.label)")
        div.selectBox(@click="toggleOptionBox()")
            span.valueLabel(:class="{'placeholder' : !value}")
                template(v-if="value") {{selectedValue}}
                template(v-else) {{evalText(blok.placeholder)}}
            span.action(:class="{'close' : openOptions}")
            div.selectOptionsBox(ref="selectOptionsBox" :style="{height: currentHeight + 'px'}")
                div.selectOptionsItem(v-for="(option,index) in blok.options" :key="blok.name + '_'+ ind + '_' + index" @click="setSelectValue(option.value, option.label, option.id)") {{evalText(option.label)}}
</template>

<script>
export default {
    props : [
        'blok',
        'ind'
    ],
    data(){
        return{
            value: null,
            openOptions: false,
            selectedValue: '',
            realHeight: false,
            currentHeight: false,
            newOption: null,
            actionMessage: "",
            messageState: null,
            evalText(s) {
                try{
                    s = eval(s);
                }catch(err){
                    s = s;
                }

                return s;
            },
        }
    },
    mounted(){ 
        this.$nuxt.$on('closeOtherOptions', ind => {
            if(ind != this.ind){
                this.openOptions = false;
                this.currentHeight = 0; 
            }
        });
        this.realHeight = this.$refs.selectOptionsBox.getBoundingClientRect().height;
        this.currentHeight = 0;

        if(this.blok.value){
            for(var i in this.blok.options){
                if(this.blok.options[i].value == this.blok.value){
                    this.value = this.blok.value;
                    this.selectedValue = this.blok.options[i].label;
                    this.$forceUpdate();
                }
            }
        }
        
    },
    computed:{
        blokValue(){
            return this.blok.value;
        }
    },
    watch:{
        blokValue(to,from){
            if(to){
                for(var i in this.blok.options){
                    if(this.blok.options[i].value == to){
                        this.value = to;
                        this.selectedValue = this.blok.options[i].label;
                        this.$forceUpdate();
                    }
                }
            }
        }
    },
    methods: {
        // fieldChanged(e){
        //     this.$nuxt.$emit('fieldChanged',e);
        // },
        setSelectValue(value, label, id){
            value = {
                index : this.ind,
                value: value,
                id : id
            }
            this.value = value.value;
            this.selectedValue = label;
            this.$emit('setValue', value)
        },
        toggleOptionBox(){
            if(!this.openOptions){
                this.$nuxt.$emit('closeOtherOptions' , this.ind);
            }
            this.openOptions = !this.openOptions;
            if(this.openOptions){
                this.currentHeight = this.realHeight;
            }else{
                this.currentHeight = 0; 
            }
            
        },
    
    },
    beforeDestroy() {
        this.$nuxt.$off('closeOtherOptions');
    },
}
</script>
