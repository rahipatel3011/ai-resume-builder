import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/clerk-react";
import GlobalApi from "../../service/GlobalApi";
import ResumeCardItem from "./components/ResumeCardItem";

function DashBoard() {
  const [resumeList, setResumeList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    // call function to get list when user is availabale or user is changed
    user && GetResumeList();
  }, [user]);

  /**
   * Get all user's resume list
   */
  function GetResumeList() {
    const userEmail = user?.primaryEmailAddress.emailAddress;
    GlobalApi.GetUserResume(userEmail).then((resp) => {
      setResumeList(resp.data.data);
    });
  }
  
  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resumes</h2>
      <p>Start creating AI resume to your next job role</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5">
        <AddResume />
        {resumeList && resumeList.map((resume, index) => <ResumeCardItem key={index} resume={resume} refreshData={GetResumeList}/> )}
      </div>
    </div>
  );
}

export default DashBoard;
