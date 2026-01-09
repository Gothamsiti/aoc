<template lang="pug">
    div.field(:class="[blok.type, {'error' : blok.error}, {'compiled' : value}, {'focus' : focused}]")   
        template(v-if="blok.type == 'textarea'")
            textarea(v-model="value" v-on:change="fieldChanged" :name="getName()" :id="getName()" :placeholder="blok.required ? evalText(blok.placeholder)+' *' : evalText(blok.placeholder)")
            label(v-if="blok.label" :for="getName()" v-html="evalText(blok.label)")
        template(v-else-if="blok.type == 'privacy'")
            div.checkboxBox(@click="toggleValue()" :class="{'checked' : value}")
            input(v-model="value" v-on:change="fieldChanged" type="checkbox" :name="getName()+'_privacy'" :id="getName()")
            label.label(:for="getName()" v-html="evalText(blok.label)")
        template(v-else-if="blok.type == 'testo'")
            div(v-html="blok.value")
        template(v-else-if="blok.type == 'select' && blok.select.length > 0")
            select(v-model="value" :name="getName()" :id="getName()" v-on:change="fieldChanged" :class="{'error' : blok.error }")
                option(:value="null" disabled)
                option(v-for="option in blok.select" :value="option.value") {{ option.label }}
            label.label(:for="getName()" v-html="evalText(blok.label)")
        template(v-else-if="blok.type == 'file'")
            input.file(v-on:change="fieldChanged" :type="'file'" :name="getName()" :id="getName()" ref="inputFile" :accept="blok.acceptFormat" :data-max-size="blok.maxSize")
            .fakeInput(@click.prevent="$refs.inputFile.click()")
                input(v-model="blok.insertedFilename" :type="'text'" :name="'fileField'+getName()" :id="'fileField'+getName()" disabled)
            label(v-if="blok.label" :for="'fileField'+getName()" v-html="evalText(blok.label)")
        template(v-else)
            input(v-model="value" v-on:change="fieldChanged" :type="'text'" :name="getName()" :id="getName()" :placeholder="blok.required ? evalText(blok.placeholder)+' *' : evalText(blok.placeholder)" :class="{'error' : blok.error }" )
            label(v-if="blok.label" :for="getName()" v-html="evalText(blok.label)")
</template>
<script>
import * as moment from 'moment';
export default {
    data() {
        return {
            value : null,
            focused : false,
            evalText(s) {
                try{
                    s = eval(s);
                }catch(err){
                    s = s;
                }

                return s;
            },
            getName(){
                return this.blok.name ? this.blok.name : this.ind;
            },
        }
    },
    props : [
        'blok',
        'ind',
    ],
    created(){
        this.blok.error = false;
        if(this.blok.multiLang){
            // if(this.blok.value){
            //     this.value = this.blok.value[this.$store.state.lang.activeInsertLang];
            // }
        } else if(this.blok.value) {
            this.value = this.blok.value;
        }
    },
    mounted(){
        this.$nuxt.$on("evalField",(val) => {
            this.whoIsValidating(val);
        });
        this.$nuxt.$on("clearValue",() => {
            if(this.blok.type == 'file'){
                this.blok.insertedFilename = null;
                this.blok.insertedFileType = null;
                this.blok.value = null;
                this.value = null;
                this.$refs.inputFile.value = null;
            }
            if(this.blok.type != 'testo')  this.value = null;
            this.$forceUpdate();
        });
    },
    computed:{
        insertActiveLang(){
            return this.$store.state.lang ? this.$store.state.lang.activeInsertLang : null;
        }
    },
    methods :{
        setChecked(){
            if(!this.blok.locked){
                this.value = !this.value;
                this.blok.value = this.value;
            }
        },
        fieldChanged(e){
            this.whoIsValidating();
            for(var child in this.$parent.$children){
                this.$parent.$children[child].$forceUpdate();
            }
        },
        whoIsValidating(val){
            if(val){
                for(var i in val){
                    if(i == this.ind){
                        this.evalField()
                    }
                }
            }else{
                this.evalField()
            }
        },
        evalField(val){
            if(this.blok.multiLang){
                // if(typeof this.blok.value == 'object' && this.blok.value != null){
                //     this.blok.value[this.$store.state.lang.activeInsertLang] = this.value;
                // } else {
                //     this.blok.value = {};
                //     this.blok.value[this.$store.state.lang.activeInsertLang] = this.value;
                // }
            } else {
                if(this.blok.type == 'file'){
                    if(this.$refs.inputFile.files.length > 0){
                        this.blok.insertedFilename = this.$refs.inputFile.files[0].name;
                        this.blok.insertedFileType = this.$refs.inputFile.files[0].type;
                        this.value = this.blok.insertedFilename;
                        var file = this.$refs.inputFile.files[0];
                        var reader = new FileReader();
                        reader.onloadend = () => {
                            var b64 = reader.result.replace(/^data:.+;base64,/, '');
                            this.blok.value = b64;
                        };
                        reader.readAsDataURL(file);
                    }
                } else {
                    this.blok.value = this.value;
                }
            }
            if(this.blok.type != 'testo'){
                if(this.blok.required || this.blok.typeof){
                    if(this.blok.type != 'file'){
                        this.blok.error = this.$testEmpty(this.blok.value);
                    } else {
                        this.blok.error = (this.blok.insertedFilename == null || this.blok.insertedFilename == undefined)
                    }
                    if(!this.blok.error){
                        switch(this.blok.type){
                            case 'email':
                                this.blok.error = !this.$testEmail(this.blok.value);
                            break;
                            // case 'tel':
                            //     this.blok.error = !this.$testPhone(this.blok.value);
                            // break;
                            // case 'acceptance':
                            //     this.blok.error = !this.blok.value;
                            // break;
                            // case 'select':
                            //     this.blok.error = !this.blok.value;
                            // break;
                            // case 'radio':
                            //     this.blok.error = !this.blok.value;
                            // break;
                            // case 'checkbox':
                            //     this.blok.error = !this.blok.value;
                            // break;
                            case 'file':
                            break;
                            case 'privacy':
                                this.blok.error = !this.blok.value;
                            break;
                            case 'text': 
                                if(this.blok.typeof == 'number'){
                                    if(this.blok.value && String(this.blok.value).indexOf(',') != -1){
                                        if(this.blok.value.length - this.blok.value.indexOf(',') == 2 || this.blok.value.length - this.blok.value.indexOf(',') == 3){
                                            this.blok.value = this.blok.value.replace(',','.');
                                        }
                                    }
                                    if(typeof parseFloat(this.blok.value) != 'number' || isNaN(this.blok.value)){
                                        this.blok.error = 1;
                                    }
                                } else {
                                    // if(typeof this.blok.value == 'object'){
                                    //      this.blok.error = !this.blok.value[this.$store.state.lang.activeInsertLang];
                                    // } else {
                                        this.blok.error = !this.blok.value;
                                    // }
                                }
                                break;
                            default:
                                break;
                        }
                        this.$forceUpdate();
                    }else{
                        this.$forceUpdate();
                        return false;
                    }
                }
            }
        },
        // setValue(obj){
        //     if(this.ind == obj.index){
        //         // this.$nuxt.$emit('setValChanged', obj);
        //         this.value = obj.value;
        //         this.fieldChanged();
        //     }
        // },
        toggleValue(){
            this.value = !this.value;
            this.fieldChanged();
        }
    },
    beforeDestroy() {
        this.$nuxt.$off('evalField');
        this.$nuxt.$off('emptyField');
        this.$nuxt.$off('setValue');
        this.$nuxt.$off('clearValue');
    },
}
</script>