import React from "react";

function SkillPreview({ resumeInfo }) {
  return (
    <div className="my-6 page-break section">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Skills
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />
      <div className="my-4 px-3">
      <ul className="">
        {resumeInfo?.skills && resumeInfo?.skills.map((item, index) => (
          <li key={index} className="text-xs"><span className="font-bold">{item?.skillType}:</span> {item?.skillValues?.join(", ")}</li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default SkillPreview;
