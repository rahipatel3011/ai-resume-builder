import React from 'react'

function PersonalDetailPreview({resumeInfo}) {
  return (
    <>
    <div className='personal-details header' id="personal-details">
        <h2 className='font-bold text-xl text-center' style={{color: resumeInfo?.themeColor}}>{resumeInfo?.firstName} {resumeInfo?.lastName}</h2>
        {/* <h2 className='text-center text-sm font-medium'>{resumeInfo?.jobTitle}</h2> */}
        <h2 className='text-center font-normal text-xs'>{resumeInfo?.city}, {resumeInfo?.state} | <span className='text-blue-600 underline'>{resumeInfo?.email}</span> | {resumeInfo?.phone}</h2>
        <h2 className='text-center font-normal text-xs'>{resumeInfo?.gitHubUrl && <a className='text-blue-600 underline' href={resumeInfo?.gitHubUrl}>GitHub</a> } {resumeInfo?.gitHubUrl && '|'} {resumeInfo?.linkedInUrl && <a className='text-blue-600 underline' href={resumeInfo?.linkedInUrl}>LinkedIn</a>}</h2>
        <hr className='border-[1.5px] my-2' style={{borderColor: resumeInfo?.themeColor}}/>
    </div>
    </>
  )
}

export default PersonalDetailPreview