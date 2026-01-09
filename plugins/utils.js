const defaultTitle = process.env.DEFAULT_TITLE;
const defaultDescription = process.env.DEFAULT_TITLE;
export default ({ app }, inject) => {
    inject('addZero', (s) =>{
        var n = parseInt(s);
        if(!n && n != 0) return s;
        if(n >= 10) return s;
        return "0"+n;
    });
    inject('testEmpty', (s) => {
        return s == null || s == undefined || s == '';
    });
    inject('testEmail', (s) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(s).toLowerCase());
    });
    inject('testPhone', (s) => {
        var re2 = /^(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89]|39[0-9])\d{7}$/;
        var re3 = /(0{1}[1-9]{1,3})[\s|\.|\-]?(\d{4,})/;
        return re2.test(s) || re3.test(s);
    })
    inject('testCF', (s) => {
        s = s.toUpperCase();
        var re = /^[A-Z]{6}[A-Z0-9]{2}[A-Z][A-Z0-9]{2}[A-Z][A-Z0-9]{3}[A-Z]$/;
        return re.test(s);
    })
    inject("testPod",(s) => {
        var error = 0;
        return error == 0;
    })
    inject("testIban",(s) => {
        if(s.length != 27) return false;
        var re = /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/;
        return re.test(s);
    })
    inject("testLength", (s) => {
        return s.s.length == s.l;
    })
    // inject('formatDate', (d) => {
    //     var month = '' + (d.getMonth() + 1),
    //         day = '' + d.getDate(),
    //         year = d.getFullYear();

    //     if (month.length < 2) month = '0' + month;
    //     if (day.length < 2) day = '0' + day;

    //     return [year, month, day].join('-');
    // })
    inject('testPassword', (obj) => {
        if(obj.value){
            if(obj.length){
                if(obj.value.length >= obj.length){
                    return true;
                }
            }else{
                return true
            }
        }else{
            return false;
        }
    })
    inject("head",(story) => {
        if(!app.$__){
            app.$__ = function(s){ return s }
        }
        if(!story){
            return {
                title : '',
                meta : []
            };
        }
        var metadata = story.content.metadata;
        if(metadata){
            var title = metadata.title ? metadata.title.replace(/<\/?[^>]+(>|$)/g, "") :  '';
            var description = metadata.description ? metadata.description.replace(/<\/?[^>]+(>|$)/g, "") :  app.$__('defaultDescription');
            var robots = metadata.follow == '' || metadata.follow == undefined || metadata.follow == 'follow' ? 'index, follow' : 'noindex, nofollow';
            title = title.replace(/%page%/g, story.name);
            return {
                title: title +  app.$__('defaultTitlePostfix'),
                meta: [
                    { hid: 'og:type', property: 'og:type', content: 'article' },
                    { hid: 'og:title', property: 'og:title', content: title + app.$__('defaultTitlePostfix') },
                    { hid: 'og:site_name', property: 'og:site_name', content: 'Air Ocean Cargo'},
                    { hid: 'description', name: 'description', content: description },
                    { hid: 'og:url', property: 'og:url', content: process.env.APIHOST+story.full_slug},
                    { hid: 'og:description', property: 'og:description', content: description },
                    { hid: 'og:image', property: 'og:image', content: metadata.image },
                    { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
                    { hid: 'og:image:height', property: 'og:image:height', content: '630' },
                    { hid : 'robots', name : 'robots', content : robots },
                    { rel: 'msapplication-square70x70logo', content: 'favicon/ms-icon-70x70.png' },
                    { rel: 'msapplication-square150x150logo', content: 'favicon/ms-icon-150x150.png' },
                    { rel: 'msapplication-square310x310logo', content: 'favicon/ms-icon-310x310.png' },
                ]
            }
        }
    })
    inject("trimText",(str, maxLen, strip = false, separator = "") => {
        str = strip ? str.replace(/<\/?[^>]+(>|$)/g, "") : str;
        if (str.length <= maxLen) return str;
        return str.substr(0, str.lastIndexOf(separator, maxLen)) + " [...]";
    })
    inject("elementHover",e => {
        app.store.commit("pointer/hoverElement",e);
    })
    inject("elementOut",e => {
        app.store.commit("pointer/outElement",e);
    })
    inject("toSingleLettersAndRows",s =>{
        console.log(s);
        if(!s.length > 0) return ''
        s = s.split("\n");
        for(var i in s){
            s[i] = "<span class=\"row\">" + s[i].replace(/[\S\s]/g, '<span class="letter"><span>$&</span></span>') + "</span>";
        }
        return s.join("");
    })
    inject("toSingleLetters",s => {
        return s.replace(/[\S\s]/g, '<span class="letter">$&</span>');
    })
    inject('formatPrice', (n) => {
        n = n === null ? 0 : n == undefined ? '0' : n;
        n = n.slice(0, -2).replace('.',',');

        var float = n.substring(n.indexOf(','), n.length);
        var int = parseInt(n);
        return int + '<span>'+float+'</span> €';
    });
    inject('formatTime', (n) => {
        var num = n === null ? 0 : parseInt(n);
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + 'h ' + (rminutes ? rminutes+'min' : '');
    });
    inject('priceFormatter', (n) => {
        n = n === null ? 0 : n == NaN ? 0 : n;
        if(!parseFloat(n)) return n + ',00 €';
        n = String(app.$roundNumber(parseFloat(n),2));
        var floatPoint = n.indexOf('.');
        if(floatPoint == -1){
            n += ",00";
        } else if(n.length - floatPoint == 2) {
            n = n.replace('.',',');
            n += "0";
        } else {
            n = n.replace('.',',');
        }
        var integer = n.substring(0,n.indexOf(','));
        var float = n.substring(n.indexOf(','), n.length);
        
        integer = integer.replace('.','').replace(',','');
        integer = integer.split("").reverse().join("");
        if(integer.length > 3){
            integer = integer.slice(0,3) + '.' + integer.slice(3);
        }
        if(integer.length > 7){
            integer = integer.slice(0,7) + '.' + integer.slice(7);
        }
        integer = integer.split("").reverse().join("");
        return integer + float + ' €' ;
    });
    inject('roundNumber',(num,scale) => {
        if(!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale)  + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if(+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    });
    inject('formatTimeslot',(obj) => {
        return obj.from.substring(0,5) ;
        // + " - " + obj.to.substring(0,5)
    });
    inject('formatDate',(t,format) => {
        var moment = require('moment');
        moment.locale(app.router.currentRoute.params.lang);
        var date;
        if(format){
            date = moment(t).format(format);
        } else {
            date = moment(t,'YYYY-MM-DD').format('dddd') + ' ' + moment(t,'YYYY-MM-DD').format('LL');
        }
        return date;
    });
    inject('mw',(n) => {
        return parseInt(100/20*parseInt(n)) + 'vw';
    });
    inject('mwToPx',(h,n) => {
        return parseInt(h/20*parseInt(n));
    });
    inject('IOS', ()=>{
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
          ].includes(navigator.platform)
          || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    });
}