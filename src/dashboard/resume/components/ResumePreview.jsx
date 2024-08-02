import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect } from "react";
import PersonalDetailPreview from "./preview/PersonalDetailPreview";
import SummaryPreview from "./preview/SummaryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EducationalPreview";
import SkillPreview from "./preview/SkillPreview";
import ProjectPreview from "./preview/ProjectPreview";

function ResumePreview() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="shadow-lg h-full p-14"
      style={{ borderColor: resumeInfo?.themeColor }}
      id="previewResume"
    >
      <div id="resume">
        {/* Personal Detail */}
        <PersonalDetailPreview resumeInfo={resumeInfo} />
        {/* Summary */}
        <SummaryPreview resumeInfo={resumeInfo} />
        {/* Professional Experience */}
        <ExperiencePreview resumeInfo={resumeInfo} />
        {/* Education detail */}
        <EducationalPreview resumeInfo={resumeInfo} />
        {/* Project Preview */}
        <ProjectPreview resumeInfo={resumeInfo} />
        {/* Skills */}
        <SkillPreview resumeInfo={resumeInfo} />
      </div>
    </div>
  );
}

export default ResumePreview;
