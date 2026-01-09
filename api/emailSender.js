const axios = require('axios');
const StoryblokClient = require('storyblok-js-client')

class emailSender {
    constructor(){
        this.Storyblok = new StoryblokClient({
            accessToken: process.env.NODE_ENV == 'production' ? process.env.SB_PRODUCTION : process.env.SB_DEVELOPMENT,
            version : process.env.NODE_ENV == 'production' ? 'published' : 'draft' ,
            cache: {
                clear: 'auto',
                type: 'memory'
            }
        });
    }

    async sendEmail(defaultTpl, sbTpl, template, object, fields = {}, attachments = {}, to){
        return new Promise(async (resolve,reject) => {
            
            if(sbTpl){
                this.Storyblok.flushCache();
                template = await this.Storyblok.get('cdn/stories/system/notifications/'+sbTpl).then(res => { return res.data.story.content }).catch(err => { console.log("SB-err", err) });
            } else if(!template || template == null || template == ''){
                template = {};
                template.text = this.generateTemplateFromFields(fields);
            } else {
                let tmp = template;
                template = {};
                template.text = tmp;
            }

            let fromEmail = process.env.SENGRID_FROM ? process.env.SENGRID_FROM : 'diego@gothamsiti.it'; // DEFAULT EMAILS FROM
            // if(fields.email){
            //     fromEmail = fields.email;
            // }
            let emailObject = "New Enquiry" // DEFAULT EMAILS OBJECT
            if(template.title){
                emailObject = template.title;
            } else if (fields.emailObject){
                emailObject = fields.emailObject;
            } else if(object){
                emailObject = object;
            }

            for(let k in fields){
                let rex = new RegExp('\\['+k+'\\]',"g");
                template.text = template.text.replace(rex, fields[k]);
            }
            if(process.env.APIHOST){
                template.text = template.text.replace(/\[HOST\]/g,process.env.APIHOST);
            }
            
            let submitObj = { 
                personalizations : [
                    {
                        to : [
                            {
                                email : process.env.NODE_ENV == 'production' ? process.env['SENGRID_TO_'+to] ? process.env['SENGRID_TO_'+to] : process.env.SENGRID_TO_contacts : "diego@gothamsiti.it", // SEND TO CUSTOMER EMAIL 
                            }
                        ]
                    } 
                ],
                from : {
                    email: fromEmail,
                },
                subject : emailObject,
                content : [
                    {
                        type: 'text/html',
                        value: template.text
                    }
                ]
            }
            
            var attach = [];
            for(var i in attachments){
                attach.push({
                    filename : attachments[i].name,
                    content: attachments[i].value,
                    type : attachments[i].type
                })
            }
            if(attach.length > 0){
                submitObj.attachments = attach;
            }

            if(defaultTpl){
                this.wrapInDefaultSBTemplate(submitObj)
                .then(res => { 
                    resolve(res);
                })
                .catch(err => {
                    reject(err.stack);
                })
            } else {
                this.send(submitObj)
                .then(res => { 
                    resolve(res);
                })
                .catch(err => {
                    reject(err.stack);
                })
            }
        })
    }

    async wrapInDefaultSBTemplate(submitObj){
        return new Promise(async (resolve,reject) => {
            this.Storyblok.flushCache();
            let template = await this.Storyblok.get('cdn/stories/system/notifications/emailtemplate',{
                version: process.env.NODE_ENV == 'production' ? 'published' : 'draft',
            }).then(sbResp => {
                return sbResp.data.story.content.text;
            }).catch(sbErr => {
                console.log(sbErr);
            })

            for(let i in submitObj.content){
                if(submitObj.content[i].type == "text/html"){
                    submitObj.content[i].value = template.replace(/\$_CUSTOMBODY/g, submitObj.content[i].value);
                }
            }

            this.send(submitObj)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err.stack);
            })
        })
    }

    async send(submitObj){
        return new Promise(async (resolve,reject) => {
            axios.post('https://api.sendgrid.com/v3/mail/send', submitObj,{
                headers : {
                    authorization : 'Bearer ' + process.env.SENGRID_KEY
                }
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }

    generateTemplateFromFields(fields){
        let template = "";
        for(let k in fields){
            template += "<p><strong>" + k + "</strong> : " + fields[k] + " </p>";
        }
        return template;
    }
}

module.exports = new emailSender;