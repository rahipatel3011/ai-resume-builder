import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { Loader2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

function PersonalDetails({ setEnableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const documentId = params.documentId;

  useEffect(() => {}, []);

  const handleInputChange = (event) => {
    setEnableNext(false);
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setResumeInfo({ ...resumeInfo, [name]: value });
  };

  const onSave = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = { data: formData };
    GlobalApi.UpdateResumeDetail(documentId, data).then((resp) => {
      setIsLoading(false);
      setEnableNext(true);
      toast("Details updated")
    }).catch(err=>{
        setIsLoading(false);
        console.error(err);
    });
  };
  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name*</label>
            <Input name="firstName" defaultValue={resumeInfo?.firstName} required onChange={handleInputChange} placeholder="First Name" />
          </div>
          <div>
            <label className="text-sm">Last Name*</label>
            <Input name="lastName" defaultValue={resumeInfo?.lastName} required onChange={handleInputChange} placeholder="Last Name" />
          </div>
          <div className="col-span-2">
            <label className="text-sm ">Job Title*</label>
            <Input name="jobTitle" defaultValue={resumeInfo?.jobTitle} required onChange={handleInputChange} placeholder="Full Stack Developer" />
          </div>
          <div>
            <label className="text-sm">City*</label>
            <Input name="city" defaultValue={resumeInfo?.city} required onChange={handleInputChange} placeholder="Toronto"/>
          </div>
          <div>
            <label className="text-sm">State/Province*</label>
            <Input name="state" defaultValue={resumeInfo?.state} required onChange={handleInputChange} placeholder="ON"/>
          </div>
          <div>
            <label className="text-sm">Phone*</label>
            <Input
            defaultValue={resumeInfo?.phone}
              name="phone"
              required
              onChange={handleInputChange}
              placeholder="(999) 999-999"
            />
          </div>
          <div>
            <label className="text-sm">Email*</label>
            <Input type="email" name="email" defaultValue={resumeInfo?.email} required onChange={handleInputChange} />
          </div>
          <div >
            <label className="text-sm ">LinkedIn URL</label>
            <Input name="linkedInUrl" defaultValue={resumeInfo?.linkedInUrl} onChange={handleInputChange} placeholder="Full Stack Developer"/>
          </div>
          <div >
            <label className="text-sm ">Github URL</label>
            <Input name="gitHubUrl" defaultValue={resumeInfo?.gitHubUrl} onChange={handleInputChange} placeholder="Full Stack Developer"/>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" />: 'Save'}</Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
