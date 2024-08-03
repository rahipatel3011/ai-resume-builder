import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { generateResumePDF } from "../../data/generateResumePDF";
function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState();
  const { resumeId } = useParams();

  useEffect(() => {
    GlobalApi.GetUserResumeById(resumeId)
      .then((resp) => {
        setResumeInfo(resp.data.data);
      })
      .catch((e) => {
        toast("Could not load resume");
        console.error(e);
      });
  }, [resumeId]);

  const HandleDownload = async () => {
    await generateResumePDF(resumeInfo);
  };
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />
        <div className="mx-10 my-10 md:mx-20 lg:mx-72">
          <h2 className="text-center text-2xl font-medium ">
            Congratulations! Your Ultimate AI generates Resume is ready
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and you can share unique
            resume url with your friends and family
          </p>
          <div className="flex justify-between px-44 my-8">
            <Button onClick={HandleDownload} disabled={!resumeInfo}>Download</Button>
            <Button disabled={!resumeInfo}>Share</Button>
          </div>
        </div>
      </div>
      <div id="print-area" className="mx-10 my-10 md:mx-20 lg:mx-96">
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
