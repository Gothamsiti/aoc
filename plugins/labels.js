export default async (context,inject) => {
    if(context.store.state.labels ){
        if(!context.store.state.labels.labels){
            context.$storyapi.flushCache();
            var curLang = context.route.fullPath.split("/")[1];
            curLang = curLang.length == 2 ? curLang : process.env.DEFAULT_LANGUAGE;
            curLang = curLang == process.env.DEFAULT_LANGUAGE ? '' : curLang+'/';
            var labelsCount = 0;
            var labels = await context.$storyapi.get('cdn/stories/',{
                version : context.isDev ? 'draft' : 'published',
                starts_with : curLang+'system/labels'
            }).then(res => {
                labels = {}
                for(var i in res.data.stories){
                    for(var k in res.data.stories[i].content.items){
                        var label = res.data.stories[i].content.items[k];
                        labels[label.key] = label.text;
                        labelsCount++;
                    }
                }
                return labels;
            })
            if(labelsCount > 0){
                context.store.commit("labels/setLabels",labels);
            }
        }
    }
    inject('__', (s) => {
        return context.store.state.labels && context.store.state.labels.labels && context.store.state.labels.labels[s] ? context.store.state.labels.labels[s] : s;
    });
    inject('__url', (u) => {
        u = u.substring(0,1) == '/' ? u : '/' + u;
        var defLang = process.env.DEFAULT_LANGUAGE ? process.env.DEFAULT_LANGUAGE : context.store.state.languages.defaultLanguage;
        if(context.app.store.state.languages.availableLanguages.includes(u.split("/")[1])){
            return u;
        } else {
            return '/'+defLang+u;
        }
        // if(u.split("/")[1] != process.env.DEFAULT_LANGUAGE){
        //     u = "/"+context.route.fullPath.split("/")[1] + u;
        // }
        // return u;
    })
}