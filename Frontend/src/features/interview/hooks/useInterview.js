import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { generateInterviewReport, fetchReportById, fetchAllReports, generatePdf } from '../services/interview.api'
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { loading, setLoading, setButtonloading , buttonloading,  report, setReport, reports, setReports } = context;
    const { interviewId } = useParams();


    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        try {
            setLoading(true)
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })
            setReport(response.interviewReport)
            return response
        } catch (err) {
            throw err
        } finally {
            setLoading(false);
        }

    }


    const fetchReport = async (interviewId) => {
        try {
            setLoading(true)
            const response = await fetchReportById(interviewId);
            setReport(response.interviewReportById)
            return response
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false);
        }


    }

    const fetchUserReports = async () => {
        try {
            setLoading(true)
            const response = await fetchAllReports();
            setReports(response.fetchAllReport)
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false);
        }
    }

    const generateResumePdf = async ({interviewReportId}) => {
        try{
            setButtonloading(true);
            const response = await generatePdf({interviewReportId});
            const pdfBlob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }catch(error){
           console.log(error.message)
        }finally{
            setButtonloading(false);
        }
    }

    useEffect(() => {
        if (interviewId) {
            fetchReport(interviewId);
        } else {
            fetchUserReports()
        }
    }, [interviewId])


    return { loading, setLoading, buttonloading, setButtonloading, report, setReport, reports, setReports, generateReport, generateResumePdf,  fetchReport, fetchUserReports }
}