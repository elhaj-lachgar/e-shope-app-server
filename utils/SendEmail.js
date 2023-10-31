const nodemailer = require('nodemailer');

const handleasync = require('express-async-handler')

// to do fix probleme of provider

const SendEmail = handleasync (async  ( email , code , name  ) => {

    
// create transport and set config
    const transport = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure : process.env.EMAIL_SECURE ,

        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS
        }

    });
    
// contant of email
    const message = `Hi ${name}\n
        this email is for your requiste of change password \n 
        you have to you have to copir this password \n
        ${code}\n
        this code will be expired in 10 min \n
        this email from team of E-shope` 


    // send email
    const response = await transport.sendMail ( {
        from : email, 
        to :email ,
        subject : 'reste code' ,
        text : message ,
        });

} )



module.exports = SendEmail ;
