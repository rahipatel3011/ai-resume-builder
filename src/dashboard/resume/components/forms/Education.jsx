import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const EDUCATION_DETAILS = {
  universityName: " ",
  degree: " ",
  major: " ",
  startDate: "",
  endDate: new Date().toISOString().split('T')[0],
  description: "",
};

function Education() {
  const params = useParams();
  const documentId = params.documentId;
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [educationalList, setEducationalList] = useState(
    resumeInfo?.education || { ...EDUCATION_DETAILS }
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setResumeInfo((prevInfo) => ({ ...prevInfo, education: educationalList }));
  }, [educationalList]);

  function handleChange({ name, value }, index) {
    const copyOfEducationList = educationalList.slice();
    copyOfEducationList[index][name] = value;
    setEducationalList(copyOfEducationList);
  }

  function onSave() {
    setIsLoading(true);
    const data = {
      data: {
        education: educationalList.map(({ id, ...restInfo }) => restInfo),
      },
    };

    

    GlobalApi.UpdateResumeDetail(documentId, data)
      .then((resp) => {
        setIsLoading(false);
        toast("Details updated");
      })
      .catch((e) => {
        setIsLoading(false);
        toast("Server Error, Please try again!");
      });
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>
      <div className="">
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>University Name</label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChange(e.target, index)}
                  defaultValue={item?.universityName}
                />
              </div>

              <div>
                <label>Degree</label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e.target, index)}
                  defaultValue={item?.degree}
                />
              </div>

              <div>
                <label>Major</label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e.target, index)}
                  defaultValue={item?.major}
                />
              </div>

              <div>
                <label>Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChange(e.target, index)}
                  defaultValue={item?.startDate}
                />
              </div>

              <div>
                <label>End Date</label>
                <Input
                  disabled={item?.currentlyStudying}
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChange(e.target, index)}
                  defaultValue={item?.endDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(checked) =>
                    handleChange(
                      { name: "currentlyStudying", value: checked },
                      index
                    )
                  }
                  type="checkbox"
                  id={`currentlyStudying${index}`}
                  checked={item?.currentlyStudying}
                />
                <label
                  htmlFor={`currentlyStudying${index}`}
                  className="text-sm font-medium"
                >
                  Present
                </label>
              </div>

              <div className="col-span-2">
                <label>Description</label>
                <Textarea
                  name="description"
                  onChange={(e) => handleChange(e.target, index)}
                  defaultValue={item?.description}
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
              setEducationalList([...educationalList, { ...EDUCATION_DETAILS }])
            }
            variant="outline"
            className="text-primary"
          >
            {" "}
            + Add More Education
          </Button>
          <Button
            onClick={() =>
              setEducationalList((prevList) => prevList.slice(0, -1))
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
  );
}

export default Education;
