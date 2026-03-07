const express = require('express');
const { isLoggedIn } = require('../middlewares/auth.middleware');
const { generateReport } = require('../controller/interview.controller');
const upload = require('../middlewares/multer.middleware');

const interviewRouter = express.Router();

/**
 * @route POST /api/report/generate,
 * @description This is the route where user enter the jobdesc, selfdesc, and resume
 */
interviewRouter.post('/generate', isLoggedIn, upload.single("resume") , generateReport);



module.exports = interviewRouter;
