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
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: new Date().toISOString().split('T')[0],
  workSummary: "",
};

function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experienceList, setExperienceList] = useState(
    resumeInfo?.experience || []
  );
  const [isLoading, setIsLoading] = useState(false);
  //const [isChecked, setIsChecked] = useState(resumeInfo?.isChecked || false);
  const params = useParams();
  const documentId = params.documentId;

  useEffect(() => {
    // only loads up once when the page is refreshed
    //resumeInfo?.experience.length > 0 && experienceList.length === 0 && setExperienceList(resumeInfo?.experience);

    setResumeInfo((prevInfo) => ({ ...prevInfo, experience: experienceList }));
  }, [experienceList, setResumeInfo]);

  function handleChange(index, {name, value}) {
    const copyOfExperienceList = experienceList.slice();
    copyOfExperienceList[index][name] = value;
    setExperienceList(copyOfExperienceList);

  }

  function onSave(event) {
    setIsLoading(true);
    const data = {
      data: {
        experience: experienceList.map(({ id, ...restInfo }) => restInfo),
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
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add your previous job experience</p>
        <div>
          {experienceList && experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input
                    name="title"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.title}
                  />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.companyName}
                  />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input
                    name="city"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.city}
                  />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input
                    name="state"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.state}
                  />
                </div>
                <div>
                  <label className="text-xs">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.startDate }
                  />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    onChange={(event) => handleChange(index, event.target)}
                    defaultValue={item?.endDate || new Date().toISOString().split('T')[0]}
                    disabled={item?.currentlyWorking}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={((checked)=> handleChange(index,{name:'currentlyWorking', value:checked}))}
                    type="checkbox"
                    id={`currentlyWorking${index}`}
                    checked={item?.currentlyWorking}
                  />
                  <label
                    htmlFor={`currentlyWorking${index}`}
                    className="text-sm font-medium"
                  >
                    Present
                  </label>
                </div>

                <div className="col-span-2">
                  {/* Work Summery  */}
                  <RichTextEditor
                    name="workSummary"
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
                setExperienceList([...experienceList, { ...FORM_FIELD }])
              }
              variant="outline"
              className="text-primary"
            >
              {" "}
              + Add More Experience
            </Button>
            <Button
              onClick={() =>
                setExperienceList((prevList) => prevList.slice(0, -1))
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
  );
}

export default Experience;
