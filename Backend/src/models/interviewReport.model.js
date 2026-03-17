    const mongoose = require('mongoose');




    const technicalQuestionSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, "Question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        }
    }, {
        _id: false
    })

    const behavioralQuestionSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, "Question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        }
    }, {
        _id: false
    })

    const skillGapSchema = new mongoose.Schema({
        skill: {
            type: String,
            required: [true, "Skill gaps are Required"]
        },
        severity: {
            type: String,
            enum: ["low", "high", "medium"],
            required: [true, "Severity is required"]
        }
    }, {
        _id: false
    })

    const preparationPlanSchema = new mongoose.Schema({
        day: {
            type: Number,
            required: [true, "Day is required"]
        },
        focus: {
            type: String,
            required: [true, "Day is required"]
        },
        tasks: [{
            type: String,
            required: [true, "Day is required"]
        }]
    }, {
        _id: false
    })



    const interviewReportSchema = new mongoose.Schema({
        jobDescription: {
            type: String,
            required: [true, "Job Description is Required"]
        },
        resumeText: {
            type: String,
        },
        selfDescription: {
            type: String,
            required: true,
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100,
        },
        technicalQuestion: [technicalQuestionSchema],
        behavioralQuestion: [behavioralQuestionSchema],
        skillGaps: [skillGapSchema],
        preparationPlan: [preparationPlanSchema],
        user :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        },
        title :{
            type : String,
            required : [true , "Title is Required"]
        }

    }, { timestamps: true })


    const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema);
    module.exports = interviewReportModel;
