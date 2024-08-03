import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "../../../../../service/GlobalApi";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Brain, LoaderCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { AIChatSession } from "../../../../../service/AIModal";
import { optimizedResume_prompt } from "@/data/prompts";

function Optimize({ setEnableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [jobPost, setJobPost] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aIGeneratedSummaryList, setAIGeneratedSummaryList] = useState();
  const params = useParams();
  const documentId = params.documentId;

  useEffect(() => {
    jobPost && setResumeInfo({ ...resumeInfo, jobPost });
  }, [jobPost]);

  const handleAIResumeOptimzation = async () => {
    if(!resumeInfo?.jobPost){
      toast("Please add Job Description");
      return;
    }
    setIsGenerating(true);
    setIsLoading(true);
    const PROMPT = optimizedResume_prompt.replace("{resumeData}", JSON.stringify(resumeInfo));

    const result = await AIChatSession.sendMessage(PROMPT);
    const finalResult = JSON.parse(result.response.text());
    //setAIGeneratedSummaryList(JSON.parse(result.response.text()));
    setResumeInfo(finalResult);
    setIsLoading(false);
    setIsGenerating(false);
  };

  const onSave = (event) => {
    event.preventDefault();
    const data = { data: resumeInfo };
    setIsLoading(true);
    GlobalApi.UpdateResumeDetail(documentId, data)
      .then((resp) => {
        setIsLoading(false);
        setEnableNext(true);
        toast("Job Post updated");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err.response.data);
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Optimization</h2>
      <p>Optimize your resume to improve ATS score</p>
      <form className="mt-7" onSubmit={onSave} noValidate>
        <div className="flex justify-between items-end">
          <label>Add Job post details</label>
          <Button
            type="button"
            variant="outline"
            className="border-primary text-primary flex gap-2"
            size="sm"
            onClick={handleAIResumeOptimzation}
            disabled={!resumeInfo?.jobPost}
          >
            <Brain />
            {isGenerating ? <LoaderCircle className="animate-spin" /> : "AI Optimization"}
          </Button>
        </div>
        <Textarea
          required
          rows="15"
          value={jobPost?jobPost:resumeInfo?.jobPost}
          className="mt-5"
          onChange={(e) => setJobPost(e.target.value)}
          defaultValue={jobPost?jobPost:resumeInfo?.jobPost}
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Optimize;
