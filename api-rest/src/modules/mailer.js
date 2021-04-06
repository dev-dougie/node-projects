const path = require('path')
const nodemailer = require('nodemailer');
const credentials = require('../config/mail.json')
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = credentials;

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

transport.use('compile', hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./resources/mail/')
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
}));

module.exports = transport;