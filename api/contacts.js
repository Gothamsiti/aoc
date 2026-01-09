'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const emailSender = require("./emailSender");
app.use(express.json());
app.use(bodyParser.json());

app.post("/", 
    async (req,res) => {
        var form = req.body.form;
        emailSender.sendEmail(false, false, form.emailTemplate, form.emailObject, form.fields, form.attachments, form.to)
        .then(sendEmailRes => {
            return res.status(200).send({msg: 'request sended'});
        })
        .catch(sendEmailErr => {
            return res.status(400).send({msg: sendEmailErr});
        })
    }
)

module.exports = {
    path: '/api/contacts',
    handler: app
}