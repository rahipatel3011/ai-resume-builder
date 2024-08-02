import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Checkbox } from "@/components/ui/checkbox";

const FORM_FIELD = {
  title: "",
  projectSummary: "",
  technologies: ""
};

function Project() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [projectList, setProjectList] = useState(
    resumeInfo?.project || []
  );
  const [isLoading, setIsLoading] = useState(false);
  //const [isChecked, setIsChecked] = useState(resumeInfo?.isChecked || false);
  const params = useParams();
  const documentId = params.documentId;

  function handleChange(index, {name, value}) {
    const copyOfProjectList = projectList.slice();
    copyOfProjectList[index][name] = value;
    setProjectList(copyOfProjectList);
  }

  useEffect(() => {
    // only loads up once when the page is refreshed
    //resumeInfo?.experience.length > 0 && experienceList.length === 0 && setExperienceList(resumeInfo?.experience);

    setResumeInfo((prevInfo) => ({ ...prevInfo, project: projectList }));
  }, [projectList, setResumeInfo]);

  function onSave(event) {
    setIsLoading(true);
    const data = {
      data: {
        project: projectList.map(({ id, ...restInfo }) => restInfo),
      },
    };
    console.log(data);
    GlobalApi.UpdateResumeDetail(documentId, data)
      .then((resp) => {
        setIsLoading(false);
        toast("Projects updated");
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        toast("Server Error, Please try again!");
      });
  }

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Projects</h2>
        <p>Add your Projects</p>
        <div>
          {projectList && projectList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div className="col-span-2">
                  <label className="text-xs">Project Title</label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.title}
                    placeholder="Project title"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs">Technologies </label>
                  <Input
                    name="technologies"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.technologies}
                    placeholder="React, Redis, Docker..."
                  />
                  <span className="text-xs"><em>Note: </em><i>please add all technologies using comma ( , ) seperator</i></span>
                </div>
                                
                <div className="col-span-2">
                  {/* Work Summery  */}
                  <RichTextEditor
                    name="projectSummary"
                    index={index}
                    onValueChange={handleChange}
                    resumeInfo={resumeInfo}
                    onResumeInfoChange={setResumeInfo}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-5">
          <div className="flex gap-2">
            <Button
              onClick={() =>
                setProjectList([...projectList, { ...FORM_FIELD }])
              }
              variant="outline"
              className="text-primary"
            >
              {" "}
              + Add More Project
            </Button>
            <Button
              onClick={() =>
                setProjectList((prevList) => prevList.slice(0, -1))
              }
              variant="outline"
              className="text-primary"
            >
              {" "}
              - Remove
            </Button>
          </div>
          <Button disabled={isLoading} onClick={(e) => onSave(e)}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Project