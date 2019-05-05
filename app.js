var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;
const pg = require('pg');
const nodemailer = require("nodemailer");
app.set('view engine', 'ejs');
app.use(express.static('public'));
var i;
var mailOptions;
var transporter

// ***********************************************************************************************************
function send(array) {
    mailOptions.to = array[i];
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            console.log('errrrrrrror' + i)

            i++;
            if (i < array.length) {

                send(array);
            } else {

                console.log('Done');
            }
        } else {
            console.log('Email sent: ' + info.response + 'I =' + i);
            i++;
            if (i < array.length) {

                send(array);
            } else {

                console.log('Done');
            }
        }
    });
}
// ***********************************************************************************************************
app.get('/', function (req, res) {
    res.render('index')
})
// ***********************************************************************************************************
app.post('/', function (req, res) {
    console.log(req.body)

    if (req.body.user.slice(-9) == 'yahoo.com') {
        transporter = nodemailer.createTransport({
            service: 'yahoo', host: 'smtp.mail.yahoo.com', secure: true, port: 465, auth: { user: req.body.user, pass: req.body.pass }
        });


    } else if (req.body.user.slice(-9) == 'gmail.com') {
        transporter = nodemailer.createTransport({
            service: 'gmail', host: 'smtp.gmail.com', secure: true, port: 465, auth: { user: req.body.user, pass: req.body.pass }
        });

    } else if (req.body.user.slice(-7) == 'aol.com') {
        transporter = nodemailer.createTransport({
            service: 'aol', host: 'smtp.aol.com', secure: false, port: 465, auth: { user: req.body.user, pass: req.body.pass }
        });
    }




    mailOptions = {
        from: req.body.from+'<'+req.body.user+'>',
        to: '',
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html
    };
i = 0;
var array = JSON.parse(req.body.array)
console.log('\n***************************************************************************************************************\n')
console.log(transporter)
console.log('\n********************************************************************************************************************\n')
send(array);
res.render('index')
})
// ***********************************************************************************************************
app.listen(PORT, function () {
    console.log('Mailer started')
})