const express = require('express');
const { isLoggedIn } = require('../middlewares/auth.middleware');
const { generateReport, fetchReportById, fetchAllReport , generatePdf } = require('../controller/interview.controller');
const upload = require('../middlewares/multer.middleware');

const interviewRouter = express.Router();

/**
 * @route POST /api/report/generate,
 * @description This is the route where user enter the jobdesc, selfdesc, and resume
 */
interviewRouter.post('/generate', isLoggedIn, upload.single("resume") , generateReport);


/**
 * @route POST /api/report/fetchAll
 * @description this is the route to fetch all reports of the user
 */
interviewRouter.get('/fetchAllReports', isLoggedIn , fetchAllReport );

/**
 * @route POST /api/report/:interviewId
 * @description this is the route to access a report based on the interview id
 */
interviewRouter.get('/:interviewId', isLoggedIn , fetchReportById );



/**
 * @route POST /api/report/resume/pdf/:interviewReportId
 * @description this is the route to generate the resume in pdf format based on the interview report id
 */
interviewRouter.post('/resume/pdf/:interviewReportId', isLoggedIn , generatePdf );




module.exports = interviewRouter;
