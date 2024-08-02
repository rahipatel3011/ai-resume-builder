export const summary_prompt = "Job Title: {jobTitle}, Depends on job title give me list of  summary for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summary and experience_level Field in JSON Format"

export const workSummary_prompt = "Position title: {title}. Based on the position title, write 5-7 professional and unique bullet points for my experience in my resume. Please provide the bullet points as a string but containing ul,li html list."

export const projectSummary_prompt = "Project title: {title}, Technologies: {tech}. Based on the project title and used technologies, write 3-4 professional and unique bullet points for my resume. Please provide the bullet points as a string but containing ul,li html list."



export const optimizedResume_prompt = "Given the following JSON data containing a resume and a job post, optimize and enhance the resume details to improve the ATS (Applicant Tracking System) score. Use relevant keywords from the job post to update the resume content without changing the schema of the JSON: {resumeData} Ensure the JSON data is optimized with relevant keywords from the job post to improve ATS scoring, while keeping the structure unchanged. Please add or remove HTML tag in resume detail to highlight keywords such as <b></b>, <i></i> and doesn't remove ul and li tag"




/* 
export const projectSummary_prompt = "Project title: {title}, Technologies: {tech}. Based on the project title and used technologies, write 3-4 professional and unique bullet points for my resume. Please provide the bullet points as an array and must add '@' at the end of all sentences except the last one."




*/