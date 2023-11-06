const express = require('express');
const checkAuth = require('../middleware/auth');
const FrontController = require('../controllers/FrontController');
const CourseController = require('../controllers/CourseController');
const AdminController = require('../controllers/Admin/AdminController');
const router = express.Router();

router.get("/", FrontController.login);
router.get("/registration", FrontController.registration);
router.get("/about", checkAuth, FrontController.about);
router.get("/team", checkAuth, FrontController.team);
router.get("/contact", checkAuth, FrontController.contact);
router.get("/dashboard", checkAuth, FrontController.dashboard);
router.get("/profile", checkAuth, FrontController.profile);
router.get('/courseDisplay', checkAuth, CourseController.courseDisplay);
router.get('/course_view/:id', checkAuth, CourseController.courseView);
router.get('/course_edit/:id', checkAuth, CourseController.courseEdit);
router.get('/admin/getAllData', checkAuth, AdminController.getAllData);
// router.get('/course_delete/:id', checkAuth, CourseController.courseDelete);
router.get('/logout', FrontController.logout);

// POST METHODS
router.post("/verify_login", FrontController.verifyLogin); // GET USER INSERT DATA
router.post("/user_insert", FrontController.userInsert); // GET USER INSERT DATA
router.post("/course_insert", checkAuth, CourseController.courseInsert); // GET USER COURSE REGISTRATION DATA
router.post('/course_update/:id', checkAuth, CourseController.courseUpdate); // UPDATE COURSE REGISTRATION DATA
router.post('/update_profile/', checkAuth, FrontController.updateProfile); // UPDATE USER PROFILE
router.post('/update_password', checkAuth, FrontController.updatePassword); // UPDATE USER PROFILE
router.post('/update_status/:id', checkAuth, AdminController.updateStatus);



module.exports = router;