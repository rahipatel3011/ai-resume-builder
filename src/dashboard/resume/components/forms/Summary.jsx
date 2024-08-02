import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "../../../../../service/GlobalApi";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Brain, LoaderCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { AIChatSession } from "../../../../../service/AIModal";
import { summary_prompt } from "@/data/prompts";

function Summary({ setEnableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [aIGeneratedSummaryList, setAIGeneratedSummaryList] = useState();
  const params = useParams();
  const documentId = params.documentId;

  useEffect(() => {
    summary && setResumeInfo({ ...resumeInfo, summary });
  }, [summary]);

  const GenerateSumaryFromAI = async () => {
    setIsLoading(true);
    const PROMPT = summary_prompt.replace("{jobTitle}", resumeInfo.jobTitle);
    const result = await AIChatSession.sendMessage(PROMPT);
    setAIGeneratedSummaryList(JSON.parse(result.response.text()));
    setIsLoading(false);
  };

  const onSave = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = { data: { summary } };
    GlobalApi.UpdateResumeDetail(documentId, data)
      .then((resp) => {
        setIsLoading(false);
        setEnableNext(true);
        toast("Details updated");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Summary</h2>
      <p>Add Summary for your job title</p>
      <form className="mt-7" onSubmit={onSave}>
        <div className="flex justify-between items-end">
          <label>Add Summary</label>
          <Button
            variant="outline"
            className="border-primary text-primary flex gap-2"
            size="sm"
            onClick={GenerateSumaryFromAI}
          >
            <Brain />
            Generate from AI
          </Button>
        </div>
        <Textarea
          required
          value={summary}
          className="mt-5"
          onChange={(e) => setSummary(e.target.value)}
          defaultValue={summary?summary:resumeInfo?.summary}
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>

      {/* AI Generated Summary */}
      {aIGeneratedSummaryList && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aIGeneratedSummaryList.map((item, index) => (
            <div
              key={index}
              onClick={()=>setSummary(item?.summary)}
              className="shadow-lg rounded-lg p-5 my-5 cursor-pointer border-2 border-dashed border-primary"
            >
              <h2 className="font-bold my-1">
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
