import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./QuestionPaperAdmin.css";

const QuestionPaperAdmin = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  // const [loggedInBranch, setLoggedInBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [questionPapers, setQuestionPapers] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission
  // const [uploadedFiles, setUploadedFiles] = useState({
  //   cie1: null,
  //   cie2: null,
  //   cie3: null,
  //   see: null,
  // });



  const fileInputs = useRef({});

  const [newQuestionPaper, setNewQuestionPaper] = useState({
    subjectName: "",
    cie1: "",
    cie2: "",
    cie3: "",
  
  });

  const [hodBranch, setHodBranch] = useState("");

  useEffect(() => {
    const branch = localStorage.getItem("hodBranch");
    if (branch) {
      setHodBranch(branch);
    }
  }, []);




  const [isFormValidated, setIsFormValidated] = useState(false);

  useEffect(() => {
    const allFilesUploaded = newQuestionPaper.cie1 && newQuestionPaper.cie2 && newQuestionPaper.cie3 && newQuestionPaper.see;
    const subjectGiven = newQuestionPaper.subjectName.trim() !== "";

    setIsFormValidated(allFilesUploaded && subjectGiven);
  }, [newQuestionPaper]);



  // const hodCredentials = [
  //   { email: "cs@college.com", password: "cs123", branch: "CS" },
  //   { email: "ec@college.com", password: "ec123", branch: "EC" },
  //   { email: "eee@college.com", password: "eee123", branch: "EEE" },
  //   { email: "ce@college.com", password: "ce123", branch: "CE" },
  //   { email: "at@college.com", password: "at123", branch: "AT" },
  //   { email: "ch@college.com", password: "ch123", branch: "CH" },
  //   { email: "me@college.com", password: "me123", branch: "ME" },
  //   { email: "po@college.com", password: "po123", branch: "PO" },
  //   { email: "pratyush@gmail.com", password: "pratyush" }
  // ];

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   const hod = hodCredentials.find(
  //     (cred) =>
  //       cred.email === loginDetails.email && cred.password === loginDetails.password
  //   );

  //   if (loginDetails.email === "pratyush@gmail.com") {
  //     window.location.href = "/questionpaper/login";  // Redirect to /questionpaper/login
  //     return;  // Prevent further logic execution if redirected
  //   }

  //   if (hod) {
  //     setIsLoggedIn(true);
  //     setLoggedInBranch(hod.branch);
  //     setErrorMessage("");
  //   } else {
  //     setErrorMessage("Invalid email or password. Please try again.");
  //   }
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   setLoginDetails({ email: "", password: "" });
  //   setLoggedInBranch("");
  //   setSemester("");
  //   setYear("");
  //   setQuestionPapers([]);
  //   setIsDataFetched(false);
  // };

  const fetchQuestionPapers = async () => {
    if (!semester || !year) {
      setErrorMessage("Please select both Semester and Year to continue.");
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/api/questionpapers`, {
        params: { branch: hodBranch, sem: semester, year },
      });
      setQuestionPapers(response.data);
      setIsDataFetched(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching question papers:", error);
      setErrorMessage("Failed to fetch question papers. Please try again.");
    }
  };


  const handleFileUpload = async (e, identifier) => {


    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setIsSubmitting(true);
        const response = await axios.post(`${baseUrl}/api/uploadPdf`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });


        //setUploadedFiles({ ...uploadedFiles, [identifier]: response.data.pdfLink });
        setNewQuestionPaper((prev) => {
          const updated = { ...prev, [identifier]: response.data.pdfLink };
          return updated;
        });

        setErrorMessage("");

      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage("Failed to upload the file. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrorMessage("Please upload a valid PDF file.");
    }
  };

  const handleAddQuestionPaper = async () => {
    if (!newQuestionPaper.subjectName || !semester || !year) {
      setErrorMessage("Please fill in all the fields.");
      console.log("returnded backkkk");
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}/api/questionpapers`, {
        branch: hodBranch,
        sem: semester,
        year,
        ...newQuestionPaper,
      });
      setQuestionPapers([...questionPapers, response.data]);
      setNewQuestionPaper({
        subjectName: "",
        cie1: "",
        cie2: "",
        cie3: "",
       
      });
      setIsFormValidated(false);

      //setUploadedFiles({ cie1: null, cie2: null, cie3: null, see: null });
      Object.values(fileInputs.current).forEach((input) => {
        if (input) input.value = "";
      });
      alert("Question paper added successfully!");
    } catch (error) {
      console.error("Error adding question paper:", error);
      setErrorMessage("Failed to add question paper. Please try again.");
    }
  };
  // Dependencies ensure real-time updates


  const handleDeleteQuestionPaper = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/questionpapers/${id}`);
      setQuestionPapers(questionPapers.filter((qp) => qp.id !== id));
      alert("Question paper deleted successfully!");
    } catch (error) {
      console.error("Error deleting question paper:", error);
      setErrorMessage("Failed to delete question paper. Please try again.");
    }
  };



  return (
    <div className="qp-unique-container">



      <div className="admin-panel">
        <span className="admin-title">QUESTION PAPER PAGE</span>
        {hodBranch && <span className="hod-branch">Branch: {hodBranch}</span>}
      </div>


      <div className="qp-unique-selection-section">
        <h2 className="qp-unique-title">Select Semester</h2>
        <div className="qp-unique-buttons">
          {["Sem1", "Sem2", "Sem3", "Sem4", "Sem5"].map((sem) => (
            <button
              key={sem}
              onClick={() => setSemester(sem)}
              className={`qp-unique-semester-btn ${semester === sem ? "selected" : ""}`}
            >
              {sem}
            </button>
          ))}
        </div>
      </div>

      <div className="qp-unique-selection-section">
        <h2 className="qp-unique-title">Select Year</h2>
        <div className="qp-unique-buttons">
          {["2024"].map((yr) => (
            <button
              key={yr}
              onClick={() => setYear(yr)}
              className={`qp-unique-year-btn ${year === yr ? "selected" : ""}`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      <div className="qp-unique-action-buttons">
        <button onClick={fetchQuestionPapers} className="qp-unique-show-btn">
          Show Question Papers
        </button>
      </div>

      {errorMessage && <div className="qp-error-message">{errorMessage}</div>}

      {isDataFetched && (
        <div className="qp-app__container">
          <h1 className="qp-app__title">Question Paper Management</h1>
          <table className="qp-table__container">
            <thead>
              <tr>
                <th className="qp-table__heading">Branch</th>
                <th className="qp-table__heading">Subject Name</th>
                <th className="qp-table__heading">CIE 1</th>
                <th className="qp-table__heading">CIE 2</th>
                <th className="qp-table__heading">CIE 3</th>
                
                <th className="qp-table__heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questionPapers.length > 0 ? (
                questionPapers.map((qp) => (
                  <tr key={qp.id}>
                    <td className="qp-table__data">{qp.branch}</td>
                    <td className="qp-table__data">{qp.subjectName}</td>
                    <td className="qp-table__data">
                      <a href={qp.cie1} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td className="qp-table__data">
                      <a href={qp.cie2} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td className="qp-table__data">
                      <a href={qp.cie3} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    
                    <td className="qp-table__data">
                      <button
                        className="qp-table__delete-btn"
                        onClick={() => handleDeleteQuestionPaper(qp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="qp-table__data">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="qp-add-paper-container">
        <h2 className="qp-add-title">Add New Question Paper</h2>
        <form className="qp-add-form" onSubmit={(e) => e.preventDefault()}>
          <div className="qp-input-row">
            <input type="text" value={hodBranch} disabled placeholder="Branch" className="qp-add-input" />
            <input type="text" value={semester} disabled placeholder="Semester" className="qp-add-input" />
            <input type="text" value={year} disabled placeholder="Year" className="qp-add-input" />
            <input
              type="text"
              placeholder="Subject Name"
              value={newQuestionPaper.subjectName}
              onChange={(e) =>
                setNewQuestionPaper({ ...newQuestionPaper, subjectName: e.target.value })
              }
              className="qp-add-input"
            />
          </div>
          <br></br>
          <div className="qp-file-row">
            <label>CIE 1 File</label>
            <input
              type="file"
              ref={(el) => (fileInputs.current.cie1 = el)}

              accept="application/pdf" // Restrict to PDF files
              onChange={(e) => handleFileUpload(e, 'cie1')} // Pass the identifier 'cie1'
              className="qp-add-input"
              required
            />
          </div>
          {/* <label>CIE 1 File</label> */}

          {/* CIE 2 File Upload */}
          <div className="qp-file-row">
            <label>CIE 2 File</label>
            <input
              type="file"
              ref={(el) => (fileInputs.current.cie2 = el)}

              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, 'cie2')} // Pass the identifier 'cie2'
              className="qp-add-input"
              required
            />
          </div>


          {/* CIE 3 File Upload */}
          <div className="qp-file-row">
            <label>CIE 3 File</label>
            <input
              type="file"
              ref={(el) => (fileInputs.current.cie3 = el)}

              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, 'cie3')} // Pass the identifier 'cie3'
              className="qp-add-input"
              required
            />
          </div>


          


          {/* Submit Button */}

          <button
            onClick={handleAddQuestionPaper}
            className="qp-add-btn"
            disabled={isSubmitting || !isFormValidated} // Disable button while submitting or if form is invalid
          >
            {isSubmitting ? 'Uploading...' : 'Add Question Paper'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionPaperAdmin;

