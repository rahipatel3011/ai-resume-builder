import React from 'react'
import {formateDate} from "../../../../data/convert";

function ExperiencePreview({resumeInfo}) {
  return (
    <div className='my-6 page-break section'>
        <h2 className='text-center font-bold text-sm mb-2' style={{color:resumeInfo?.themeColor}}>Professional Experience</h2>
        <hr style={{borderColor:resumeInfo?.themeColor}} />

        {resumeInfo?.experience && resumeInfo?.experience.map((exp, index)=>(
            <div key={index} className='my-5'>
                <h2 className='text-sm font-bold' style={{color:resumeInfo?.themeColor}}>{exp?.title}</h2>
                <h2 className='text-xs flex justify-between'>{exp?.companyName}, {exp?.city}, {exp?.state} <span>{formateDate(exp?.startDate)} - {exp?.currentlyWorking?'Present' : formateDate(exp?.endDate)}</span></h2>
                {/* <p className='text-xs my-2'>
                    {exp?.workSummary}
                </p> */}
                <div className='text-xs my-2 px-3' dangerouslySetInnerHTML={{__html: exp?.workSummary}}/>
            </div>
        ))}
    </div>
  )
}

export default ExperiencePreview