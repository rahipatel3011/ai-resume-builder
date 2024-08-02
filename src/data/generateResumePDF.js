import html2canvas from "html2canvas";
import { Parser } from "htmlparser2";
import jsPDF from "jspdf";
import { formateDate } from "./convert";



export async function generateResumePDF(resumeData) {
  const margin = 0.75; // Margin in inches
  const contentWidth = 8; // Width in inches
  const contentHeight = 11 - margin; // Height in inches
  let yPosition = margin; // Start position for content
  let pageNumber = 1;
  const marginBetweenLine = 0.2;
  const marginBetweenSection = 0.4;
  const marginBetweenSubSection = 0.4;
  const HEADER_FONT_SIZE = 13;
  const CONTENT_FONT_SIZE = 11;
  const FONT_TYPE = "helvetica";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
  });
  doc.setFont(FONT_TYPE);

  const centerText = (
    text,
    yPosition,
    fontSize = CONTENT_FONT_SIZE,
    bold = false
  ) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(fontSize);
    doc.setFont(FONT_TYPE, bold ? "bold" : "normal");
    const textWidth = doc.getTextWidth(text);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.text(text, xPosition, yPosition);
    doc.setFont(FONT_TYPE, "normal");
    doc.setFontSize(CONTENT_FONT_SIZE);
  };

  const leftText = (text, yPosition, fontSize = CONTENT_FONT_SIZE) => {
    doc.setFontSize(fontSize);
    doc.text(text, margin, yPosition);
    doc.setFontSize(CONTENT_FONT_SIZE);
  };

  const rightText = (text, yPosition, fontSize = CONTENT_FONT_SIZE) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(text);
    doc.setFontSize(fontSize);
    doc.text(text, pageWidth - margin - textWidth, yPosition);
    doc.setFontSize(CONTENT_FONT_SIZE);
  };

  // const addBulletPoints = (items, yPosition, indent = 0.3) => {
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   doc.setFontSize(CONTENT_FONT_SIZE);
  //   doc.setTextColor("black");
  //   doc.setFillColor("black");

  //   items.forEach((item) => {
  //     const lines = doc.splitTextToSize(item.trim(), pageWidth - indent - 2 * margin);
  //     lines.forEach((line, index) => {
  //       if (index === 0) {
  //         doc.circle(margin + indent - 0.1, yPosition - 0.05, 0.02, 'F');
  //       }

  //       // if(line.split(":").length > 1){
  //       //   doc.setFont(FONT_TYPE,"bold");
  //       //   let splittedText = doc.getTextWidth(line.split(":")[0].trim()+": ");

  //       //   doc.text(line.split(":")[0].trim()+":", margin + indent, yPosition, { maxWidth: contentWidth - indent - margin });
  //       //   doc.setFont(FONT_TYPE,"normal");
  //       //   doc.text(line.split(":")[1].trim(), margin + indent + splittedText, yPosition, { maxWidth: contentWidth - indent - margin })
  //       // }else{
  //         doc.text(line.trim(), margin + indent, yPosition, { maxWidth: contentWidth - indent - margin });
  //       // }

  //       yPosition += marginBetweenLine;
  //     });
  //   });

  //   return yPosition - marginBetweenLine;
  // };

  const addBulletPoints = (items, yPosition, indent = 0.4) => {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(CONTENT_FONT_SIZE);
    doc.setTextColor("black");

    const renderLine = (line, yPosition) => {
      let currentX = margin + indent;

      const parser = new Parser(
        {
          onopentag(name) {
            if (name === "b") {
              doc.setFont(FONT_TYPE, "bold");
            } else if (name === "i") {
              doc.setFont(FONT_TYPE, "italic");
            }
          },
          ontext(text) {
            doc.text(text, currentX , yPosition, {
              maxWidth: pageWidth - margin - indent,
            });
            currentX += doc.getTextWidth(text);
          },
          onclosetag(name) {
            if (name === "b" || name === "i") {
              doc.setFont(FONT_TYPE, "normal");
            }
          },
        },
        { decodeEntities: true }
      );

      parser.write(line);
      parser.end();
    };

    items.forEach((item) => {
      const lines = doc.splitTextToSize(
        item.trim(),
        pageWidth - indent - 2 * margin
      );
      lines.forEach((line, index) => {
        if (index === 0) {
          doc.circle(margin + indent - 0.2, yPosition - 0.05, 0.03, "F");
        }
        renderLine(line.trim(), yPosition);
        yPosition += marginBetweenLine;
      });
    });

    return yPosition - marginBetweenLine;
  };

  const addLine = (
    yPosition,
    lineWidth = 0.01,
    color = resumeData?.themeColor,
    lineLength
  ) => {
    doc.setLineWidth(lineWidth);
    doc.setDrawColor(color);
    const pageWidth = doc.internal.pageSize.getWidth();
    yPosition += 0.065;
    lineLength === "extended"
      ? doc.line(margin - 0.1, yPosition, pageWidth - (margin - 0.1), yPosition)
      : doc.line(margin, yPosition, pageWidth - margin, yPosition);

    doc.setDrawColor("black");
    return yPosition - 0.05 + marginBetweenSubSection;
  };

  const addHeader = () => {
    doc.setTextColor(resumeData?.themeColor);
    centerText(
      `${resumeData.firstName} ${resumeData.lastName}`,
      yPosition,
      18,
      true
    );
    doc.setTextColor("black");
    yPosition += marginBetweenLine;
    centerText(
      `${resumeData.city}, ${resumeData.state} | ${resumeData.email} | ${resumeData.phone}`,
      yPosition,
      11
    );
    yPosition += marginBetweenLine;

    // Add GitHub and LinkedIn with hyperlinks
    const githubText = "GitHub";
    const linkedInText = "LinkedIn";
    const separator = " | ";
    const combinedText = `${githubText}${separator}${linkedInText}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const combinedTextWidth = doc.getTextWidth(combinedText);
    const xPosition = (pageWidth - combinedTextWidth) / 2;

    // Draw GitHub text
    doc.setTextColor("blue");
    //doc.setFont(FONT_TYPE, undefined, "underline");
    doc.textWithLink(githubText, xPosition, yPosition, {
      url: resumeData?.gitHubUrl,
    });

    // Draw separator
    doc.setTextColor("black");
    //doc.setFont(FONT_TYPE, undefined, "normal");
    const separatorWidth = doc.getTextWidth(separator);
    doc.text(separator, xPosition + doc.getTextWidth(githubText), yPosition);

    // Draw LinkedIn text
    doc.setTextColor("blue");
    //doc.setFont(FONT_TYPE, undefined, "underline");
    doc.textWithLink(
      linkedInText,
      xPosition + doc.getTextWidth(githubText) + separatorWidth,
      yPosition,
      { url: resumeData?.linkedInUrl }
    );

    // Draw underline manually for both
    const githubWidth = doc.getTextWidth(githubText);
    const linkedInWidth = doc.getTextWidth(linkedInText);
    doc.setDrawColor("blue");
    doc.setLineWidth(0.005);
    doc.line(
      xPosition,
      yPosition + 0.02,
      xPosition + githubWidth,
      yPosition + 0.02
    ); // Underline GitHub
    doc.line(
      xPosition + githubWidth + separatorWidth,
      yPosition + 0.02,
      xPosition + githubWidth + separatorWidth + linkedInWidth,
      yPosition + 0.02
    ); // Underline LinkedIn

    // Reset text color and font
    doc.setTextColor("black");
    doc.setFont(FONT_TYPE, "normal");

    //doc.setDrawColor(resumeData?.themeColor || "black");
    yPosition = addLine(yPosition, 0.02, resumeData?.themeColor, "extended");
    doc.setTextColor("black");
  };

  const addFooter = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const textWidth = doc.getTextWidth(`${pageNumber} | P a g e`);
    const yPositionForFooter = pageHeight - marginBetweenSection;
    doc.setFontSize(10);
    doc.setTextColor("#747678");
    addLine(yPositionForFooter - marginBetweenLine - 0.05, 0.005, "#edebeb");
    centerText(
      `${(resumeData.firstName + " " + resumeData.lastName).toUpperCase()} | ${
        resumeData.phone
      } | ${resumeData.email}`,
      yPositionForFooter,
      9
    );
    rightText(`${pageNumber} | P a g e`, yPositionForFooter, 9);
    doc.setTextColor("black");
  };

  const addTextWithPagination = (text, yPosition) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const lines = doc.splitTextToSize(text.trim(), pageWidth - 2 * margin);
    lines.forEach((line) => {
      if (yPosition > contentHeight) {
        addFooter();
        doc.addPage();
        yPosition = margin;
        pageNumber += 1;
      }
      doc.text(line, margin, yPosition);
      yPosition += marginBetweenLine;
    });
    return yPosition - marginBetweenLine;
  };

  const addContent = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Summary
    yPosition = addTextWithPagination(resumeData?.summary, yPosition);
    yPosition += marginBetweenSection;

    // Experience
    let requiredSpaceForExperience =
      (doc.splitTextToSize(
        resumeData.experience[0].workSummary.trim(),
        pageWidth - 0.3 - 2 * margin
      ).length -
        1 +
        3) *
        marginBetweenLine +
      0.1 +
      marginBetweenSubSection;
    let availableSpaceForExperience = pageHeight - margin - yPosition;
    if (requiredSpaceForExperience > availableSpaceForExperience) {
      addFooter();
      doc.addPage();
      yPosition = margin;
      pageNumber += 1;
    }
    doc.setFontSize(HEADER_FONT_SIZE);
    doc.setFont(FONT_TYPE, "bold");
    doc.setTextColor(resumeData.themeColor || "black");
    doc.text("EXPERIENCE", margin, yPosition);
    doc.setFont(FONT_TYPE, "normal");
    yPosition = addLine(yPosition);

    resumeData.experience.forEach((exp) => {
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setTextColor("#000000");
      const lines = doc.splitTextToSize(
        exp.workSummary.trim(),
        pageWidth - 0.3 - 2 * margin
      );
      let requiredSpaceToAddSection =
        (lines.length - 1 + 2) * marginBetweenLine + 0.1;
      let availableSpace = pageHeight - margin - yPosition;
      if (requiredSpaceToAddSection > availableSpace) {
        addFooter();
        doc.addPage();
        yPosition = margin;
        pageNumber += 1;
      }
      doc.setFont(FONT_TYPE, "bold");
      doc.text(exp.title, margin, yPosition);
      rightText(
        `${formateDate(exp.startDate)} - ${
          exp.currentlyWorking ? "Present" : formateDate(exp.endDate)
        }`,
        yPosition,
        CONTENT_FONT_SIZE
      );
      doc.setFont(FONT_TYPE, "normal");
      yPosition += marginBetweenLine;
      doc.text(
        `${exp.companyName}, ${exp.city}, ${exp.state}`,
        margin,
        yPosition
      );
      yPosition += marginBetweenLine + 0.1;
      yPosition = addBulletPoints(
        exp.workSummary
          .trim()
          .replaceAll("<ul>", "")
          .replaceAll(/<li[^>]*>/g, "")
          .replace("</ul>", "")
          .split("</li>")
          .slice(0, -1),
        yPosition
      );
      yPosition += marginBetweenSubSection;
    });

    yPosition += marginBetweenSection - marginBetweenSubSection;

    // Education
    let requiredSpaceForEducation =
      (doc.splitTextToSize(
        resumeData.education[0].description.trim(),
        pageWidth - 2 * margin
      ).length -
        1 +
        3) *
        marginBetweenLine +
      0.1 +
      marginBetweenSubSection;
    let availableSpaceForEducation =
      pageHeight - margin - yPosition + marginBetweenLine;
    if (requiredSpaceForEducation > availableSpaceForEducation) {
      addFooter();
      doc.addPage();
      yPosition = margin;
      pageNumber += 1;
    }
    doc.setFontSize(HEADER_FONT_SIZE);
    doc.setTextColor(resumeData.themeColor);
    doc.setFont(FONT_TYPE, "bold");
    doc.text("EDUCATION", margin, yPosition);
    doc.setFont(FONT_TYPE, "normal");
    yPosition = addLine(yPosition);

    resumeData.education.forEach((edu) => {
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setTextColor("#000000");
      const lines = doc.splitTextToSize(
        edu.description.trim(),
        pageWidth - 2 * margin
      );
      let requiredSpaceForEducationSection =
        (lines.length - 1 + 2) * marginBetweenLine + 0.1;
      let availableSpaceForEducationSection =
        pageHeight - margin - yPosition + marginBetweenLine;
      if (
        requiredSpaceForEducationSection > availableSpaceForEducationSection
      ) {
        addFooter();
        doc.addPage();
        yPosition = margin;
        pageNumber += 1;
      }
      doc.setFont(FONT_TYPE, "bold");
      doc.text(`${edu.degree.trim()} in ${edu.major}`, margin, yPosition);
      rightText(
        `${formateDate(edu.startDate)} - ${
          edu.currentlyStudying ? "Present" : formateDate(edu.endDate)
        }`,
        yPosition,
        CONTENT_FONT_SIZE
      );
      doc.setFont(FONT_TYPE, "normal");
      yPosition += marginBetweenLine;
      doc.text(edu.universityName.trim(), margin, yPosition);
      if(edu.description.trim() !== ""){
        yPosition += marginBetweenLine + 0.1;
        yPosition = addTextWithPagination(edu.description, yPosition);
      }
      
      yPosition += marginBetweenSubSection;
    });

    yPosition += marginBetweenSection - marginBetweenSubSection;

    // Projects
    let requiredSpaceForProject =
      (doc.splitTextToSize(
        resumeData.project[0].projectSummary.trim(),
        pageWidth - 0.3 - 2 * margin).length - 1 + 2) * marginBetweenLine + 0.1 + marginBetweenSubSection;
    let availableSpaceForProject = pageHeight - margin - yPosition;
    if (requiredSpaceForProject > availableSpaceForProject) {
      addFooter();
      doc.addPage();
      yPosition = margin;
      pageNumber += 1;
    }
    doc.setFontSize(HEADER_FONT_SIZE);
    doc.setFont(FONT_TYPE, "bold");
    doc.setTextColor(resumeData.themeColor || "black");
    doc.text("PROJECTS", margin, yPosition);
    doc.setFont(FONT_TYPE, "normal");
    yPosition = addLine(yPosition);

    resumeData.project.forEach((project) => {
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setTextColor("#000000");
      const lines = doc.splitTextToSize(
        project.projectSummary.trim(),
        pageWidth - 0.3 - 2 * margin
      );
      let requiredSpaceToAddSection =
        (lines.length - 1 + 1) * marginBetweenLine + 0.1;
      let availableSpace = pageHeight - margin - yPosition;
      if (requiredSpaceToAddSection > availableSpace) {
        addFooter();
        doc.addPage();
        yPosition = margin;
        pageNumber += 1;
      }
      doc.setFont(FONT_TYPE, "bold");
      const projectTitleTextWidth = doc.getTextWidth(project.title + " ");
      doc.text(project.title, margin, yPosition);
      doc.setFont(FONT_TYPE, "normal");
      const seperatorWidth = doc.getTextWidth("| ");
      doc.text("|", margin + projectTitleTextWidth, yPosition);
      doc.setFont(FONT_TYPE, "italic");
      doc.setFontSize(CONTENT_FONT_SIZE - 1);
      doc.text(`${project.technologies}`, margin + projectTitleTextWidth + seperatorWidth, yPosition);
      //RESET
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");

      yPosition += marginBetweenLine + 0.1;
      yPosition = addBulletPoints(
        project.projectSummary
          .trim()
          .replaceAll("<ul>", "")
          .replaceAll(/<li[^>]*>/g, "")
          .replace("</ul>", "")
          .split("</li>")
          .slice(0, -1),
        yPosition
      );
      yPosition += marginBetweenSubSection;
    });

    yPosition += marginBetweenSection - marginBetweenSubSection;

    // Skills
    const totalLines = resumeData.skills.reduce(
      (totalLines, skill) =>
        totalLines +
        doc.splitTextToSize(
          `${skill.skillType}: ${skill.skillValues.join(", ")}`,
          pageWidth - 0.3 - 2 * margin
        ).length,
      0
    );
    let requiredSpaceForSkills =
      totalLines * marginBetweenLine + marginBetweenSubSection;
    let availableSpaceForSkills =
      pageHeight - margin - yPosition + marginBetweenLine;
    if (requiredSpaceForSkills > availableSpaceForSkills) {
      addFooter();
      doc.addPage();
      yPosition = margin;
      pageNumber += 1;
    }
    doc.setFontSize(HEADER_FONT_SIZE);
    doc.setFont(FONT_TYPE, "bold");
    doc.setTextColor(resumeData.themeColor);
    doc.text("TECHNICAL SKILLS", margin, yPosition);
    doc.setFont(FONT_TYPE, "normal");
    yPosition = addLine(yPosition);

    doc.setFillColor("black");
    const formattedList = resumeData.skills.map(
      (item) => `<b>${item.skillType}:</b> ${item.skillValues.join(", ")}`
    );
    addBulletPoints(formattedList, yPosition);
  };

  addHeader();
  addContent();
  addFooter();

  doc.save("resume.pdf");
}

// export async function convertPDF(resumeData) {
//   const margin = 0.75; // Margin in inches
//   const contentWidth = 8; // Width in inches
//   const contentHeight = 11 - (0.75); // Height in inches
//   let yPosition = margin ; // Start position for content
//   let pageNumber = 1;
//   const marginBetweenLine = 0.2;
//   const marginBetweenSection = 0.4;
//   const marginBetweenSubSection = 0.4;
//   const HEADER_FONT_SIZE = 16;
//   const CONTENT_FONT_SIZE = 11;
//   const Font_TYPE = "helvetica";

//   const centerText = (text, yPosition, fontSize = 12, bold) => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     doc.setFontSize(fontSize);
//     (bold || "bold") && doc.setFont(Font_TYPE, "bold");
//     const textWidth = doc.getTextWidth(text);
//     const xPosition = (pageWidth - textWidth) / 2;
//     doc.text(text, xPosition, yPosition);
//     doc.setFont(Font_TYPE, "normal");
//   };

//   const leftText = (text, yPosition, fontSize = 12) => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     doc.setFontSize(fontSize);
//     const xPosition = margin;
//     doc.text(text, xPosition, yPosition);
//   };

//   const rightText = (text, yPosition, fontSize = 12) => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const textWidth = doc.getTextWidth(text);
//     doc.setFontSize(fontSize);
//     const xPosition = pageWidth - margin - textWidth;
//     doc.text(text, xPosition, yPosition);
//   };

//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "in",
//     format: "letter",
//   });
//   doc.setFont(Font_TYPE);

//   const addBulletPoints = (items, yPosition, indent = 0.3) => {
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     doc.setFontSize(CONTENT_FONT_SIZE);
//     doc.setTextColor("black");
//     doc.setFillColor("black");
//     items.forEach((item) => {
//       // Split text into lines that fit within the page width
//       const lines = doc.splitTextToSize(item.trim(), pageWidth - indent - 2 * margin);
//       // if (yPosition > contentHeight) {
//       //   doc.addPage();
//       //   yPosition = margin;
//       //   pageNumber += 1;
//       // }

//       lines.map((line, index) => {
//         // Draw the bullet point
//         index===0 && doc.circle(margin + indent - 0.1, yPosition - 0.05, 0.02, 'F');

//         // Add the text next to the bullet point
//         doc.text(line.trim(), margin + indent, yPosition, { maxWidth: contentWidth - indent - margin });
//         yPosition += marginBetweenLine; // Move down to the next line

//       });

//     });

//     return yPosition -marginBetweenLine;
//   };

//   const addLine = (yPosition, lineWidth=0.01) => {
//     doc.setLineWidth(lineWidth);
//     const pageWidth = doc.internal.pageSize.getWidth();
//     yPosition += 0.05;
//     doc.line(margin, yPosition, pageWidth - margin, yPosition); // Line from left to right
//     doc.setTextColor("black"); //after drawing line make black as default color
//     return yPosition - 0.05 + marginBetweenSubSection;
//   };

//   // Function to add a header on each page
//   const addHeader = () => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     //doc.setFillColor("white"); // Header color
//     //doc.rect(margin, margin, pageWidth - margin, 1, "F"); // Header bar
//     doc.setTextColor(resumeData?.themeColor || "black"); // Text color
//     centerText(
//       `${resumeData.firstName} ${resumeData.lastName}`,
//       margin,
//       24,
//       "bold"
//     );
//     yPosition += marginBetweenLine;
//     centerText(`${resumeData.address}`, yPosition, 11);
//     yPosition += marginBetweenLine;
//     leftText(`${resumeData.phone}`, yPosition, 11);
//     rightText(`${resumeData.email}`, yPosition, 11);
//     //draw line
//     doc.setDrawColor(resumeData?.themeColor); // Line color
//     yPosition = addLine(yPosition, 0.02)
//   };

//   // Function to add a footer on each page
//   const addFooter = () => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     doc.setFontSize(10);
//     doc.text(`Page ${pageNumber}`, margin, pageHeight - margin);
//   };

//   // Function to handle text wrapping and pagination
//   const addTextWithPagination = (text, yPosition) => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     const lines = doc.splitTextToSize(text.trim(), pageWidth - 2 * margin);

//     lines.forEach((line) => {
//       // if (yPosition > pageHeight - margin) {
//       //   console.log("page break in pagination section.");
//       //   doc.addPage();
//       //   yPosition = margin;
//       //   pageNumber += 1;
//       // }
//       doc.text(line, margin, yPosition);
//       yPosition += marginBetweenLine;
//     });
//     // because we have already increased 0.2(margin beetween line) in above line
//     return yPosition- marginBetweenLine; // return yPosition
//   };

//   // Add resume content
//   const addContent = () => {
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     // Summary
//     //doc.setFontSize(HEADER_FONT_SIZE);
//     //doc.text("Summary", margin, yPosition);
//     doc.setFontSize(CONTENT_FONT_SIZE);
//     yPosition = yPosition - marginBetweenLine + 0.1; // to adjust first line gap
//     yPosition = addTextWithPagination(resumeData?.summary, yPosition);

//     yPosition += marginBetweenSection;

//     // Experience

//     const linesForTheFirstExperience = doc.splitTextToSize(resumeData.experience[0].workSummary.trim(), pageWidth - 0.3 - 2 * margin);
//     //const linesForTheFirstExperience = doc.splitTextToSize(resumeData.experience[0].workSummary.trim(), pageWidth - 2 * margin);
//     // here i have added 3 to accomodate "EXPERIENCE" heading, position  name. in total it's 2 lines, here added 0.1 two times to accomodate 2 extra 0.1 space after titles
//     let requiredSpaceForFirstExperience = (linesForTheFirstExperience.length-1 + 3) * marginBetweenLine + 0.1 + marginBetweenSubSection;
//     let availableSpaceForFirstExperience = (pageHeight - margin) - yPosition;
//     if(requiredSpaceForFirstExperience > availableSpaceForFirstExperience){
//       doc.addPage();
//       yPosition = margin;
//       pageNumber += 1;
//     }
//     doc.setFontSize(HEADER_FONT_SIZE);
//     doc.setFont(Font_TYPE, "bold");
//     doc.setTextColor(resumeData.themeColor || 'black');
//     doc.text("Experience", margin, yPosition);
//     doc.setFont(Font_TYPE, "normal");
//     yPosition = addLine(yPosition);
//     resumeData.experience.forEach((exp) => {
//       doc.setFontSize(CONTENT_FONT_SIZE);
//       doc.setTextColor("#000000");

//       const lines = doc.splitTextToSize(exp.workSummary.trim(), pageWidth- 0.3 - 2 * margin);
//       let requiredSpaceToAddSection = (lines.length-1 + 2) * marginBetweenLine + 0.1;
//       let availableSpace = (pageHeight - margin) - yPosition;
//       if(requiredSpaceToAddSection > availableSpace){
//         doc.addPage();
//         yPosition = margin;
//         pageNumber += 1;
//       }
//       doc.setFont(Font_TYPE, "bold");
//       doc.text(exp.title, margin, yPosition);
//       rightText(`${formateDate(exp.startDate)} - ${exp.currentlyWorking ? 'Present' : formateDate(exp.endDate)}`,yPosition, CONTENT_FONT_SIZE);
//       doc.setFont(Font_TYPE, "normal");

//       yPosition += marginBetweenLine;
//       doc.text(`${exp.companyName}, ${exp.city}, ${exp.state}`, margin, yPosition);
//       yPosition += marginBetweenLine + 0.1;
//       console.log(exp.workSummary.trim().replaceAll("<ul>","").replace(/<li[^>]*>/g, ''));
//       yPosition = addBulletPoints(exp.workSummary.trim().replaceAll("<ul>","").replaceAll(/<li[^>]*>/g,'').replace("</ul>","").split("</li>").slice(0,-1), yPosition);
//       yPosition += marginBetweenSubSection;
//       //yPosition += marginBetweenLine + 0.1;
//     });

//     yPosition += marginBetweenSection - marginBetweenSubSection;
//     //yPosition += marginBetweenSection - marginBetweenLine - 0.1;

//     // Education

//     const linesForTheFirstEducation = doc.splitTextToSize(resumeData.education[0].description.trim(), pageWidth - 2*margin);
//     // here i have added 3 to accomodate "EDUCATION" heading, university name and date lines. in total it's 3 lines, 0.1 to leave a gap after educational's title details
//     let requiredSpaceForFirstEducation = (linesForTheFirstEducation.length - 1 + 3) * marginBetweenLine + 0.1 + marginBetweenSubSection;
//     let availableSpaceForFirstEducation = (pageHeight - margin) - yPosition + marginBetweenLine; // margin between line to add last line with proper margin
//     if(requiredSpaceForFirstEducation > availableSpaceForFirstEducation){
//       doc.addPage();
//       yPosition = margin;
//       pageNumber += 1;
//     }
//     doc.setFontSize(HEADER_FONT_SIZE);
//     doc.setTextColor(resumeData.themeColor);
//     doc.setFont(Font_TYPE, "bold");
//     doc.text("Education", margin, yPosition);
//     doc.setFont(Font_TYPE, "normal");
//     yPosition = addLine(yPosition);
//     resumeData.education.forEach((edu) => {
//       doc.setFontSize(CONTENT_FONT_SIZE);
//       doc.setTextColor("#000000");
//       const lines = doc.splitTextToSize(edu.description.trim(), pageWidth - 2 * margin);
//       let requiredSpaceForEducation = (lines.length-1 + 2) * marginBetweenLine + 0.1;
//       let availableSpaceForEducation = (pageHeight - margin) - yPosition + marginBetweenLine;
//       if( requiredSpaceForEducation > availableSpaceForEducation){
//         doc.addPage();
//         yPosition = margin;
//         pageNumber += 1;
//       }
//       doc.setFont(Font_TYPE, "bold");
//       doc.text(`${edu.degree.trim()} in ${edu.major}`, margin, yPosition);
//       rightText(`${formateDate(edu.startDate)} - ${edu.currentlyStudying ? 'Present' : formateDate(edu.endDate)}`,yPosition, CONTENT_FONT_SIZE);
//       doc.setFont(Font_TYPE, "normal");

//       yPosition += marginBetweenLine;
//       doc.text(edu.universityName.trim(), margin, yPosition);

//       yPosition += marginBetweenLine + 0.1;
//       yPosition = addTextWithPagination(edu.description, yPosition);
//       yPosition += marginBetweenSubSection;
//     });

//     yPosition += marginBetweenSection - marginBetweenSubSection;
//     //yPosition += marginBetweenSection - marginBetweenLine - 0.1;

//     // Skills
//      const totalLines = resumeData.skills.reduce((totalLines, skill)=>totalLines + doc.splitTextToSize(`${skill?.skillType}: ${skill.skillValues.join(", ")}`, pageWidth - 0.3 - 2*margin).length, 0);

//     // here i have added accomodate "Skills" and date lines. so totalLines - 1 + 1(Skills Heading)
//     let requiredSpaceForSkills = totalLines * marginBetweenLine + marginBetweenSubSection;
//     let availableSpaceForSkills = (pageHeight - margin) - yPosition + marginBetweenLine; // margin between line to add last line with proper margin
//     if(requiredSpaceForSkills > availableSpaceForSkills){
//       doc.addPage();
//       yPosition = margin;
//       pageNumber += 1;
//     }
//     doc.setFontSize(HEADER_FONT_SIZE);
//     doc.setTextColor(resumeData.themeColor);
//     doc.text("Skills", margin, yPosition);
//     yPosition = addLine(yPosition);

//     const formattedList = resumeData.skills.map(item=> `${item.skillType}: ${item.skillValues.join(', ')}`);

//     addBulletPoints(formattedList, yPosition);
//   };

//   addHeader();
//   addContent();
//   addFooter();

//   doc.save("resume.pdf");
// }
