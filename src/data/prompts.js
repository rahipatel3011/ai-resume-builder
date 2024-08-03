export const summary_prompt = "Job Title: {jobTitle}, Depends on job title give me list of  summary for 3 experience levels, Mid Level and Freasher level in 3 -4 lines in array format, With summary and experience_level Field in JSON Format"

export const workSummary_prompt = "Position title: {title}. Based on the position title, write 5-7 professional and unique bullet points for my experience in my resume. Please provide the bullet points as a string but containing ul,li html list."

export const projectSummary_prompt = "Project title: {title}, Technologies: {tech}. Based on the project title and used technologies, write 3-4 professional and unique bullet points for my resume. Please provide the bullet points as a string but containing ul,li html list."



export const optimizedResume_prompt = `
Given the following JSON data containing a resume and a job post, optimize and enhance the resume details to improve the ATS (Applicant Tracking System) score. Use relevant keywords from the job post to update the resume content (specifically 'summary', 'experience.workSummary', 'project.projectSummary', and 'education.description') without changing the schema of the JSON. 

1. Extract important keywords from soft skills and technical skills from the provided job post.
2. Retrieve all known skills and details from the resume data, including the 'skills' section.
3. Use the extracted keywords and the known skills/details to optimize the resume content. 
4. Summary must be 3-4 lines of the letter size page.
5. details of 'experience.workSummary' and 'project.projectSummary' must be store using html <ul><li> tag.
6. use different action verbs to minimize the repetition for the resume
Do not change any other parts of the JSON except 'summary', 'experience.workSummary', 'project.projectSummary', 'education.description' and skill.values.

Resume Data: {resumeData}

Please return the updated JSON data with optimized details for ATS scoring, keeping the structure unchanged. Please remove id, nested id, documentId, createdAt, updatedAt and locale keys from the JSON data
`;




/* 
export const projectSummary_prompt = "Project title: {title}, Technologies: {tech}. Based on the project title and used technologies, write 3-4 professional and unique bullet points for my resume. Please provide the bullet points as an array and must add '@' at the end of all sentences except the last one."




*/