import { LoaderCircle, MoreVertical, Notebook } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GlobalApi from "../../../service/GlobalApi";
import { toast } from "sonner";
import { generateResumePDF } from "../../data/generateResumePDF";

function ResumeCardItem({ resume, refreshData }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onDelete = ()=>{
    setIsLoading(true);
    GlobalApi.DeleteUserResumeById(resume.documentId).then(resp=>{
        refreshData();
        toast("Resume Deleted!")
        setIsLoading(false);
        setOpenAlert(false);
    }).catch(e=>setIsLoading(false))
  }

  return (
    <div>
      <Link to={"/dashboard/resume/" + resume.documentId + "/edit"}>
        <div
          className="p-14  bg-gradient-to-b
          from-pink-100 via-purple-200 to-blue-200
        h-[280px] 
          rounded-t-lg border-t-4"
          style={{
            borderColor: resume?.themeColor,
          }}
        >
          <div
            className="flex 
        items-center justify-center h-[180px] "
          >
            {/* <Notebook/> */}
            <img src="/cv.png" width={80} height={80} />
          </div>
        </div>
      </Link>
      <div
        className="border p-3 flex justify-between text-white rounded-b-lg shadow-lg text-center"
        style={{
          background: resume?.themeColor || "red",
        }}
      >
        <h2 className="text-sm">{resume.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                navigate("/dashboard/resume/" + resume.documentId + "/edit")
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate("/my-resume/" + resume.documentId + "/view")
              }
            >
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>generateResumePDF(resume)}
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        
          <AlertDialog open={openAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={isLoading} onClick={onDelete}>
                  {isLoading ? <LoaderCircle className="animate-spin"/> : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        
      </div>
    </div>
  );
}

export default ResumeCardItem;
