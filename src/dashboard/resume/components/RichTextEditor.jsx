import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { workSummary_prompt, projectSummary_prompt } from "@/data/prompts";
import { Brain, LoaderCircle } from "lucide-react";
import {AIChatSession} from "../../../../service/AIModal";
import { useContext, useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { toast } from "sonner";

export default function RichTextEditor({ onValueChange, index, name, resumeInfo, onResumeInfoChange }) {
  const [isLoading, setIsLoading] = useState(false);
  //const [value, setValue] = useState('');
  let value;
  if(name==="workSummary"){
    value = resumeInfo.experience[index]?.workSummary

  }else if(name==="projectSummary"){
    value = resumeInfo.project[index]?.projectSummary
  }

  const GenerateSummaryFromAI = async () => {
    setIsLoading(true);
    if(name==="workSummary" && !resumeInfo?.experience[index]?.title){
      toast("Please add position title");
      setIsLoading(false);
      return;
  
    }else if(name==="projectSummary" && !resumeInfo?.project[index]?.title && !resumeInfo?.project[index]?.technologies){
      toast("Please add project title or/and technologies");
      setIsLoading(false);
      return;
    }
    let PROMPT;
    if(name==="workSummary"){
      PROMPT = workSummary_prompt.replace(
        "{title}",
        resumeInfo.experience[index].title
      );
  
    }else if(name==="projectSummary"){
      PROMPT = projectSummary_prompt.replace(
        "{title}",
        resumeInfo.project[index].title
      ).replace("{tech}", resumeInfo.project[index].technologies);
    }
    

    const result = await AIChatSession.sendMessage(PROMPT);
    console.log(result.response.text())
    const finalValue = result.response.text().replaceAll('"',"");
    
    
    const copyInfo = {...resumeInfo};
    if(name==="workSummary"){
      copyInfo.experience[index].workSummary = finalValue;
    }else if(name==="projectSummary"){
      copyInfo.project[index].projectSummary = finalValue;
    }
    
    onResumeInfoChange(copyInfo);
    setIsLoading(false);
  };
  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          onClick={GenerateSummaryFromAI}
          variant="outline"
          className="flex gap-2 border-primary text-primary"
        >
          {isLoading ? <LoaderCircle className="animate-spin"/> : 
          <><Brain className="h-4 w-4" /> Generate from AI</>}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          onChange={(e) => {
            //setValue(e.target.value);
            e.target.name = name;
            onValueChange(index, e.target);
          }}
          value={value}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            {/* <BtnUnderline /> */}
            {/* <BtnStrikeThrough /> */}
            <Separator />
            {/* <BtnNumberedList /> */}
            <BtnBulletList />
            <Separator />
            {/* <BtnLink /> */}
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}
