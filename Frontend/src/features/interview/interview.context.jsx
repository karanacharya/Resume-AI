import { useContext } from "react";
import { createContext, useState } from "react";


export const InterviewContext = createContext();


export const InterviewProvider = ({children})=>{
     const [loading, setLoading] = useState(false);
     const [report, setReport] = useState(null);
     const [reports, setReports] = useState([]);
     const [buttonloading, setButtonloading] = useState(false)



     return (
        <InterviewContext.Provider value = {{loading,buttonloading, setButtonloading, setLoading, report, setReport, reports, setReports}}>
            {children}
        </InterviewContext.Provider>
     )
} 