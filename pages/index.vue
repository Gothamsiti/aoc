<template lang="pug">
  main.page(:class="[$route.params.folder]")
    component(v-if="story" :is="story.content.component" :story="story" :stories="stories" :key="story.uuid"  )
    mainFooter
</template>
<script>
  import homepage from '~/components/pageComponents/homepage.vue';
  import page from '~/components/pageComponents/page.vue';
  import contacts from '~/components/pageComponents/contacts.vue';
  import news from '~/components/pageComponents/news.vue';
  import workWithUs from '~/components/pageComponents/workWithUs.vue';
  import mainFooter from '~/components/system/mainFooter/mainFooter';

  export default {
    components : {
      homepage,
      page,
      contacts,
      news,
      mainFooter,
      workWithUs
    },
    computed:{
      situations(){
        return this.$store.state.layout.situations;
      },
      isHP(){
        return this.$store.state.layout.isHP;
      }
    },
    mounted(){
      this.$el.addEventListener("scroll",this.scrollHandler);
      if(this.$store.state.layout.leavePage){
        setTimeout(() => {
          this.$store.commit("layout/setLeavePage",false);
        }, 60);
      }
      if(this.$store.state.layout.preloaderGone && !this.$store.state.layout.isMetal){
        

        var folder = this.$route.params.folder+'/';
        var slug = this.$route.params.slug ? this.$route.params.slug : null;
        var fullPath = folder + (slug ? slug : '');

        var found = false;
        var indexHP = 1;

        for(var o in this.situations){
            if(this.situations[o].isHomepage) indexHP = o;
            if(this.situations[o].folders){
                for(var i in this.situations[o].folders){
                    if(folder == this.situations[o].folders[i]){
                        found = true;
                        if(this.$store.state.layout.activeSituation != parseInt(o)) this.$nuxt.$emit("changeSituation", parseInt(o));
                        break;
                    }
                    if(!found && fullPath == this.situations[o].folders[i]){
                        found = true;
                        if(this.$store.state.layout.activeSituation != parseInt(o)) this.$nuxt.$emit("changeSituation", parseInt(o));
                        break;
                    }
                }
            }
        }
        
        if(!found) this.$nuxt.$emit("changeSituation", indexHP);
      }
    },
    beforeDestroy(){
      this.$el.removeEventListener("scroll",this.scrollHandler)
    },
    beforeRouteLeave (to, from, next) {
      this.$nuxt.$emit('clearPointer');
      this.$leavePage(to,from,next,this);
    },
    beforeRouteUpdate (to, from, next) {
      this.$nuxt.$emit('clearPointer');
      this.$leavePage(to,from,next,this);
    },
    asyncData(context){
      
      if(!context.route.params.lang || context.route.params.lang.length != 2){
        context.redirect("/"+process.env.DEFAULT_LANGUAGE+ context.route.fullPath);
      }
      var defLang = process.env.DEFAULT_LANGUAGE ? process.env.DEFAULT_LANGUAGE : context.store.state.languages.defaultLanguage;
      if(context.isDev) context.app.$storyapi.flushCache();
      var isHP = false;
      var lang = context.route.params.lang != defLang ? context.route.params.lang + '/' : '';
      var endpoint = ['cdn','stories'];
      if(context.route.params.lang != defLang){
        endpoint.push(context.route.params.lang);
      }
      var version = context.query._storyblok || context.isDev ? 'draft' : 'published';
      let params = { version: version };

      if(context.route.params.folder){ endpoint.push(context.route.params.folder) }else{ endpoint.push("homepage"); isHP = true; };
      if(context.route.params.slug) endpoint.push(context.route.params.slug);
      if(context.route.params.subslug) endpoint.push(context.route.params.subslug);

      context.store.commit("layout/setHP",isHP);
      endpoint = endpoint.join("/");
      return context.app.$storyapi.get(endpoint, params).then(asyncRes => {
        if(['news','services','solutions'].includes(asyncRes.data.story.slug) && asyncRes.data.story.name == 'index'){
          params = { 
            version: version,
            starts_with: lang+asyncRes.data.story.slug,
            is_startpage: false,
            per_page: 100
          };
          endpoint = ['cdn','stories'];
          endpoint = endpoint.join("/");
          return context.app.$storyapi.get(endpoint, params).then(secondAsyncRes => {
            return {story : asyncRes.data.story, stories: secondAsyncRes.data.stories};
          }).catch(secondAsyncErr => {
            context.error({ statusCode: secondAsyncErr.response.status, message: secondAsyncErr.response.data })
          })
        } else {
          return {story : asyncRes.data.story, stories: []};
        }
      }).catch(asyncErr => {
        context.error({ statusCode: asyncErr.response.status, message: asyncErr.response.data })
      })
    },
    head(){
      if(this.story){
        if(!this.story.content){
          this.story.content = {}
        }
        if(this.story.content && !this.story.content.metadata){
          this.story.content.metadata = {
            title : this.story.content.title,
            description: this.story.content.text ? this.$storyapi.richTextResolver.render(this.story.content.text).substring(0, 149)+' ...' : null,
            follow: "follow",
            image: this.story.content.gallery && this.story.content.gallery.length > 0 ? this.story.content.gallery[0].filename : null,
          }
        }
        return this.$head(this.story);
      }
    },
    methods: {
      scrollHandler(e){
        this.$store.commit("scroll/setOnlyTop",this.$el.scrollTop);
      },
    },
  }
</script>