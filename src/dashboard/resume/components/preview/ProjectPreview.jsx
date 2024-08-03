import { formateDate } from '@/data/convert'
import React from 'react'

function ProjectPreview({resumeInfo}) {
  return (
    <div className='my-6 page-break section'>
        <h2 className='text-center font-bold text-sm mb-2' style={{color:resumeInfo?.themeColor}}>Projects</h2>
        <hr style={{borderColor:resumeInfo?.themeColor}} />

        {resumeInfo?.project && resumeInfo?.project.map((project, index)=>(
            <div key={index} className='my-5'>
                <h2 className='text-sm font-bold' style={{color:resumeInfo?.themeColor}}>{project?.title} | <i className='text-gray-500 text-xs font-normal'>{project?.technologies}</i></h2>
                
                <div className='text-xs my-2 px-3' dangerouslySetInnerHTML={{__html: project?.projectSummary}}/>
            </div>
        ))}
    </div>
  )
}

export default ProjectPreview