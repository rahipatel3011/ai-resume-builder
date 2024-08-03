import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

function Skills() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState(resumeInfo.skills || []);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const documentId = params.documentId;

  useEffect(() => {
    setResumeInfo({ ...resumeInfo, skills: skillsList });
  }, [skillsList]);

  function onHandleChange(element, index) {
    const copyList = [...skillsList];
    if(element.name === "skillType"){
      copyList[index].skillType = element.value;
    }else if(element.name === "skillValues"){
      copyList[index].skillValues = element.value.split(',').map(item => item.trim()).filter(item => item !== "");
    }
    setSkillsList(copyList);
  }

  function onSave() {
    setIsLoading(true);
    const data = {
      data: {
        skills: skillsList.map(({ id, ...restInfo }) => restInfo),
      },
    };
    GlobalApi.UpdateResumeDetail(documentId, data)
      .then((resp) => {
        setIsLoading(false);
        toast("Skills updated");
      })
      .catch((e) => {
        setIsLoading(false);
        toast("Server error, Please try again!");
      });
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your skills</p>
      <div className="">
        {skillsList &&
          skillsList.map((item, index) => (
            <div key={index} className="flex gap-2 justify-center text-center">
              <span className="my-auto">{index + 1}. </span>
              <Input
                name="skillType"
                onChange={(e) => onHandleChange(e.target, index)}
                className="m-2 w-32"
                value={item.skillType}
              />
              <Input
                name="skillValues"
                onBlur={(e) => onHandleChange(e.target, index)}
                className="m-2 w-full"
                defaultValue={item.skillValues.join(", ")}
              />
            </div>
          ))}
      </div>
      <div className="flex justify-between mt-5">
        <div className="flex gap-2">
          <Button
            onClick={() => setSkillsList((prevList) => [...prevList, {skillType:"", skillValues:[]}])}
            variant="outline"
            className="text-primary"
          >
            {" "}
            + Add More skills
          </Button>
          <Button
            onClick={() => setSkillsList((prevList) => prevList.slice(0, -1))}
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
  );
}

export default Skills;
