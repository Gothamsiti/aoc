
import redirectSSL from 'redirect-ssl';
const csvRouterParser = require('./api/redirect301');
var csvRouter = new csvRouterParser();
export default {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1 , maximum-scale=5' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: "96x96", href: '/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: "32x32", href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: "16x16", href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: "57x57", type: 'image/x-icon', href: '/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: "60x60", type: 'image/x-icon', href: '/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: "72x72", type: 'image/x-icon', href: '/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: "76x76", type: 'image/x-icon', href: '/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: "114x114", type: 'image/x-icon', href: '/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: "120x120", type: 'image/x-icon', href: '/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: "144x144", type: 'image/x-icon', href: '/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: "152x152", type: 'image/x-icon', href: '/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: "180x180", type: 'image/x-icon', href: '/apple-icon-180x180.png' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  },
  serverMiddleware : [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production'
    }),
    '~/api/contacts'
  ],
  loading: { color: '#fff' },
  css: [
    '~/assets/scss/main.scss'
  ],
  plugins: [
    { src: '~/plugins/languages.js', mode: 'server' },
    '~/plugins/utils.js',
    '~/plugins/leavePage.js',
    '~/plugins/labels.js',
    { src:'~/plugins/touchevents', mode: 'client' },
    { src: '~/plugins/vhFix.js', mode: 'client' },
    { src: '~/plugins/isWebpSupported.js', mode: 'client' },
  ],
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/redirect-module',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    ['storyblok-nuxt', {
      accessToken: process.env.SB_DEVELOPMENT,
      cacheProvider: 'memory'
    }]
  ],
  redirect:{ 
    rules : csvRouter.getArray()
  },
  robots: {
    UserAgent: '*',
    Allow : "/",
    Sitemap: 'https://airoceancargo.com/sitemap.xml'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL : process.env.APIHOST
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['font'].includes(type)
      }
    }
  },
  sitemap: {
    hostname: 'https://airoceancargo.com/',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false,
    exclude: [
      '/ie-is-not-allowed-here'
    ],
    async routes(callback){
      async function getHundred(from){
        const StoryblokClient = require('storyblok-js-client');
        const Storyblok = new StoryblokClient({
            accessToken: process.env.NODE_ENV == 'production' ? process.env.SB_PRODUCTION  : process.env.SB_DEVELOPMENT,
            cache: {
              clear: 'auto',
              type: 'memory'
            }
        })
        let version = process.env.NODE_ENV == 'production' ? 'published' : 'draft';
        return Storyblok.get('cdn/stories',{
          "per_page" : 100,
          "page" : from ? from : 1,
          version : version
        })
        .then(response => {
          let routes = [];
          let temproutes = response.data.stories.map(item => '/' + item.full_slug);

          for(var i in temproutes){
            if(response.data.stories[i]){
              if(response.data.stories[i].content.metadata){
                if(response.data.stories[i].content.metadata){
                  if(response.data.stories[i].content.metadata.follow){
                    if(response.data.stories[i].content.metadata.follow == "nofollow"){
                      continue;
                    }
                  }
                }
              }
            }
            if(temproutes[i].includes("system") || temproutes[i].includes("cookie-policy") || temproutes[i].includes("privacy-policy")) continue;
            if(temproutes[i].slice(-1) == '/') temproutes[i] = temproutes[i].substring(0, temproutes[i].length - 1) ;
            if(temproutes[i].includes("homepage")) temproutes[i] = '/';

            var objIT = {
              url: '/it'+temproutes[i],
              changefreq: 'monthly',
              priority: 1,
              lastmodISO: '2017-06-30T13:30:00.000Z',
              links : [
                  {
                    url: '/it'+temproutes[i],
                    lang: 'it-it',
                  },
                  {
                    url: '/en'+temproutes[i],
                    lang: 'en',
                  },
              ]
            }
            routes.push(objIT);
        }
        return routes;
        }).catch(error => { 
          console.log(error);
        }); 
      }
      let routes = [];
      var k = 2;
      let tempRoutes = [];
      for(var i = 1; i < k; i++){
        tempRoutes = await getHundred(i);
        if(tempRoutes.length > 0){
          routes = routes.concat(tempRoutes);
          k++;
        }else{
          break;
        }
      }
      callback(null, routes);
    }
  }
}
