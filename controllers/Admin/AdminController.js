require('dotenv').config();
const nodemailer = require('nodemailer');
const CourseModel = require("../../models/Course");

class AdminController {
  static getAllData = async (req, res) => {
    try {
      const { name, image, id } = req.data1;
      const data = await CourseModel.find();
      res.render('admin/getAllData', { msg: req.flash(), n: name, img: image, courses: data });
    }
    catch (error) {
      console.log(error);
    }
  };

  static updateStatus = async (req, res) => {
    try {
      // console.log(req.body)
      const { name, email, comment, status } = req.body;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        comment: comment,
        status: status
      });
      this.sendEmail(name, email, status, comment);
      res.redirect('/admin/getAllData');
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, status, comment) => {
    console.log(name, email, status, comment);
    //connect with the smtp server

    let transporter = await nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: "iirs kigu tuqy fgob",
      },
    });
    // INFO
    await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: `Course ${status}`, // Subject line
      text: "hello", // plain text body
      html: `<b>${name}</b> Your ${course} Course <b>${status}</b> ${status != 'successful'}! `, // html body
    });
  };
}

module.exports = AdminController;