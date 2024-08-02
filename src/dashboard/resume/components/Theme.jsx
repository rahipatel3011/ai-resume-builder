import React, { useContext } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import themeColors from "@/data/themeColors";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function Theme() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);  
  const {documentId}=useParams();

    function handleColorSelect(color){
        const data = {
            data:{
                themeColor: color
            }
        }
        setResumeInfo({...resumeInfo, themeColor: color});
        GlobalApi.UpdateResumeDetail(documentId, data).then(resp=>{
            toast("Theme Updated!");
        })
    }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {themeColors.map((item, index) => (
            <div
              key={index}
              className={`rounded-full h-5 w-5 ${resumeInfo?.themeColor===item && "border-black border-2"} hover:border border-black cursor-pointer`}
              style={{ backgroundColor: item }}
              onClick={()=>handleColorSelect(item)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Theme;
