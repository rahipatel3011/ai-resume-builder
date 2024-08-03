import React, { useEffect, useState } from "react";
import PersonalDetails from "./forms/PersonalDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from "lucide-react";
import Summary from "./forms/Summary";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Skills from "./forms/Skills";
import { Link, Navigate, useParams } from "react-router-dom";
import Theme from "./Theme";
import Project from "./forms/Project";
import Optimize from "./forms/Optimize";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const {documentId} = useParams();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <Link to="/dashboard">
            <Button>
              <Home />
            </Button>
          </Link>
          
          <Theme />
        </div>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              className=""
              size="sm"
              onClick={() => setActiveFormIndex((prev) => prev - 1)}
            >
              <ArrowLeft />
            </Button>
          )}
          {activeFormIndex < 8 && (
            <Button
              disabled={!enableNext}
              className="flex gap-2"
              size="sm"
              onClick={() => setActiveFormIndex((prev) => prev + 1)}
            >
              {" "}
              Next <ArrowRight />
            </Button>
          )}
        </div>
      </div>
      {/* Personal Details */}
      {activeFormIndex === 1 && (<PersonalDetails setEnableNext={setEnableNext} />
      )}
      {/* Summary */}
      {activeFormIndex === 2 && <Summary setEnableNext={setEnableNext} />}
      {/* experience */}
      {activeFormIndex === 3 && <Experience setEnableNext={setEnableNext} />}
      {/* educational details */}
      {activeFormIndex === 4 && <Education setEnableNext={setEnableNext} />}
      {/* projects */}
      {activeFormIndex === 5 && <Project setEnableNext={setEnableNext} />}
      {/* skills */}
      {activeFormIndex === 6 && <Skills setEnableNext={setEnableNext} />}
      {activeFormIndex === 7 && <Optimize setEnableNext={setEnableNext} />}

      {activeFormIndex === 8 && <Navigate to={`/my-resume/${documentId}/view`} />}
    </div>
  );
}

export default FormSection;
