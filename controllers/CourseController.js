require('dotenv').config();
const nodemailer = require('nodemailer');
const CourseModel = require("../models/Course");

class CourseController {
  // COURSE REGISTRATION
  static courseDisplay = async (req, res) => {
    try {
      const data = await CourseModel.find();
      const { name, image } = req.data1;
      res.render('courseDisplay', { courses: data, msg: req.flash(), n: name, img: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseView = async (req, res) => {
    try {
      const data = await CourseModel.findById(req.params.id);
      const { name, image } = req.data1;
      res.render('courseView', { course: data, msg: req.flash(), n: name, img: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseEdit = async (req, res) => {
    try {
      const data = await CourseModel.findById(req.params.id);
      const { name, image } = req.data1;
      res.render('courseEdit', { course: data, msg: req.flash(), n: name, img: image });
    } catch (error) {
      console.log(error);
    }
  };

  // POST METHODS
  static courseInsert = async (req, res) => {
    try {
      const { id } = req.data1;
      const { name, email, phone, dob, gender, address, city, collage, course } = req.body;
      // const date = new Date(dob);
      // const formattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
      const result = new CourseModel({
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        city: city,
        collage: collage,
        course: course,
        userId: id
      });
      await result.save();
      this.sendEmail(name, email, course);
      // console.log(req.body);
      res.redirect('/courseDisplay'); // ROUTER PATH
    } catch (error) {
      console.log(error);
    }
  };
  static courseUpdate = async (req, res) => {
    try {
      const { name, email, phone, dob, gender, address, collage, course } = req.body;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        collage: collage,
        course: course
      });
      console.log("Course Updated");
      res.redirect('/courseDisplay');
      // console.log(req.params.id);
      // console.log(req.body);
    } catch (error) {
      console.log(error);
    }
  };
  // static courseDelete = async (req, res) => {
  //   try {
  //     await CourseModel.findByIdAndDelete(req.params.id);
  //     res.redirect('/courseDisplay');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  static sendEmail = async (name, email, course) => {
    //connect with the smtp server

    let transporter = await nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: `Course Registration Successfully, Please wait for Approval`, // Subject line
      text: "hello", // plain text body
      html: `<b>${name}</b> Registration is  <b>${course}</b> successful! `, // html body
    });
  };
}

module.exports = CourseController;