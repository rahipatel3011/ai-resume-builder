import React from 'react'

function SummaryPreview({resumeInfo}) {
  return (
    <div className='page-break section'>
    <p className='text-xs' required={false}>
        {resumeInfo?.summary}
    </p>
    </div>
  )
}

export default SummaryPreview