const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const UserModel = require("../models/User");
const CourseModel = require("../models/Course");
cloudinary.config({
  cloud_name: 'do95oaavb',
  api_key: '885728528358733',
  api_secret: '7-Wk27LEoPjv0y13Fx9H1gI2RJQ'
});

class FrontController {
  static profile = (req, res) => {
    try {
      const { name, image, email } = req.data1;
      const user = req.data1;
      res.render('profile', { msg: req.flash(), n: name, img: image, e: email, user: user });
    } catch (error) {
      console.log(error);
    }
  };
  static about = (req, res) => {
    try {
      const { name, image } = req.data1;
      res.render('about', { n: name, img: image });
    } catch (error) {
      console.log(error);
    }
  };
  static team = (req, res) => {
    try {
      const { name, image } = req.data1;
      res.render('team', { n: name, img: image });
    } catch (error) {
      console.log(error);
    }
  };
  static login = (req, res) => {
    try {
      res.render('login', { msg: req.flash() });
    } catch (error) {
      console.log(error);
    }
  };
  static logout = (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static registration = (req, res) => {
    try {
      res.render('registration', { msg: req.flash() });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = (req, res) => {
    try {
      const { name, image } = req.data1;
      res.render('contact', { n: name, img: image });
    } catch (error) {
      console.log(error);
    }
  };
  static dashboard = async (req, res) => {
    try {
      const { name, image, id } = req.data1;
      const btech = await CourseModel.findOne({ userId: id, course: 'B.Tech' });
      const bca = await CourseModel.findOne({ userId: id, course: 'BCA' });
      const mca = await CourseModel.findOne({ userId: id, course: 'MCA' });
      res.render('dashboard', { msg: req.flash(), n: name, img: image, b: btech, bca: bca, mca: mca });
    } catch (error) {
      console.log(error);
    }
  };
  // POST METHODS
  // FOR USER REGISTRATION
  static userInsert = async (req, res) => {
    try {
      const file = req.files.image;
      // UPLOAD FOLDER TO IMAGE CLOUDINARY
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'profileImage'
      });
      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      if (user) {
        console.log("Email Already Exists");
        req.flash("error", "Email Already Exists. Please login!");
        res.redirect('/');
        return;
      }
      else {
        if (n && e && p && cp) {
          if (p === cp) {
            const hashPassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url
              }
            });
            await result.save();
            // res.status(200).json({ message: 'Registration successful' });
            req.flash('success', 'Registration Successfully, Please Login');
            console.log("User Registration Successfully");
            res.redirect('/'); // ROUTER PATH
          }
          else {
            console.log("Password Incorrect");
            req.flash("error", "Password Incorrect");
            res.redirect('/registration');
          }
        }
        else {
          console.log("All Fields are Required");
          req.flash("error", "All Fields are Required");
          res.redirect('/registration');
        }
      }

    } catch (error) {
      console.log(error);
    }
  };
  // FOR USER LOGIN
  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);
          if (isMatched) {
            if (user.role == 'admin') {
              const token = jwt.sign({ ID: user.id }, 'Prashant@1Gupta');
              res.cookie('token', token);
              req.flash("success", "Admin Successfully Logged In!");
              // res.redirect("/dashboard");
              res.redirect("/admin/getalldata");
            }
            if (user.role == "student") {
              const token = jwt.sign({ ID: user.id }, 'Prashant@1Gupta');
              res.cookie('token', token);
              req.flash("success", "Successfully Logged In!");
              res.redirect("/dashboard");
            }
          }
          else {
            req.flash("error", "Email & Password does not Matched, Try Again!");
            res.redirect('/');
          }
        }
        else {
          req.flash("error", "You are not Registered User, Please Register");
          res.redirect("/registration");
        }
      }
      else {
        req.flash("error", "All Fields are Required!");
        res.redirect('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  // FOR UPDATE PROFILE
  static updateProfile = async (req, res) => {
    try {
      const { name, email } = req.body;
      if (req.files?.profile != null) {
        const file = req.files.profile;
        // UPLOAD FOLDER TO IMAGE CLOUDINARY
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'profileImage'
        }); // UPDATE NEW IMAGE
        await cloudinary.uploader.destroy(req.data1.image.public_id); // DESTROY HE PREVIOUS IMAGE
        await UserModel.updateOne({ email: req.data1.email }, {
          image: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url
          }
        });
      }
      if (name != req.data1.name) {
        await UserModel.updateOne({ email: req.data1.email }, {
          name: name
        });
      }
      if (email != req.data1.email) {
        req.flash("error", "You Cannot Change Your Email");
        res.redirect("/profile");
        return;
        // const existUser = await UserModel.findOne({ email: req.data1.email });
        // if (existUser) {
        //   req.flash("error", "Email Already Exists");
        //   res.redirect("/profile");
        //   return;
        // }
        // else {
        //   await UserModel.updateOne({ email: req.data1.email }, {
        //     email: email
        //   });
        //   req.flash("success", "Email Updated Successfully");
        //   res.redirect("/profile");
        // }
      }
      req.flash("success", "Profile Updated Successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("/profile");
    }
  };
  // FOR UPDATE PASSWORD
  static updatePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const user = req.data1;
      if (oldPassword && newPassword && confirmPassword) {
        if (newPassword == confirmPassword) {
          const isMatched = await bcrypt.compare(oldPassword, user.password);
          if (isMatched) {
            if (newPassword == oldPassword) {
              req.flash("error", "New Password & Old Password can not be same!");
              res.redirect("/profile");
            }
            else {
              const hashPassword = await bcrypt.hash(newPassword, 10);
              await UserModel.updateOne({ email: user.email }, {
                password: hashPassword
              });
              req.flash("success", "Password Changed Successfully, Please Login Again!");
              res.redirect("/logout");
            }
          }
        }
        else {
          req.flash("error", "New Password & confirm Password does not match!");
          res.redirect("/profile");
        }

      }
      else {
        req.flash("error", "All Fields are Required!");
        res.redirect('/profile');
      }
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("/profile");
    }
  };
}

module.exports = FrontController;