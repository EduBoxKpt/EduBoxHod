import axios from "axios";
import "./NotesAdmin.css";
import React, { useState, useEffect } from "react";


const NotesAdmin = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  // const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // Error message
  const [semester, setSemester] = useState(""); // Semester state
  const [subjects, setSubjects] = useState([]); // Fetched subjects
  const [modules, setModules] = useState([]); // Modules for a subject
  const [selectedSubject, setSelectedSubject] = useState(null); // Selected subject
  const [isDataFetched, setIsDataFetched] = useState(false); // Subject fetch status
  const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility
  const [isAddSubjectVisible, setIsAddSubjectVisible] = useState(false); // Controls visibility of Add Subject form
  const [selectedFile, setSelectedFile] = useState(null); // To store the selected file
  const [isPdfUploaded, setIsPdfUploaded] = useState(false); // To track if the PDF is uploaded
  const [isUploading, setIsUploading] = useState(false); // Track if the PDF upload is in progress





  const baseUrl = process.env.REACT_APP_BASE_URL;

  // For Add Unit form
  const [moduleNo, setModuleNo] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [pdfLink, setPdfLink] = useState("");

  // For Add Subject form
  const [newSubject, setNewSubject] = useState({
    branch: "",
    semester: "",
    subject: ""
  });

  const [hodBranch, setHodBranch] = useState("");

useEffect(() => {
  const branch = localStorage.getItem("hodBranch");
  if (branch) {
    setHodBranch(branch);
    setNewSubject((prev) => ({ ...prev, branch }));
  }
}, []);


  // const hodCredentials = [
  //   { email: "cs@college.com", password: "cs123", branch: "CS" },
  //   { email: "ec@college.com", password: "ec123", branch: "EC" },
  //   { email: "eee@college.com", password: "eee123", branch: "EEE" },
  //   { email: "ce@college.com", password: "ce123", branch: "CE" },
  //   { email: "at@college.com", password: "at123", branch: "AT" },
  //   { email: "ch@college.com", password: "ch123", branch: "CH" },
  //   { email: "me@college.com", password: "me123", branch: "ME" },
  //   { email: "po@college.com", password: "po123", branch: "PO" },
  //   { email: "pratyush@gmail.com", password: "pratyush" } // Add branch for Pratyush
  // ];


  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   const hod = hodCredentials.find(
  //     (cred) =>
  //       cred.email === loginDetails.email && cred.password === loginDetails.password
  //   );

  //   if (loginDetails.email === "pratyush@gmail.com") {
  //     window.location.href = "/notes/login";  // Redirect to /questionpaper/login
  //     return;  // Prevent further logic execution if redirected
  //   }

  //   if (hod) {
  //     setIsLoggedIn(true);
  //     setErrorMessage("");
  //     setNewSubject({ ...newSubject, branch: hod.branch }); // Set branch from the logged-in user
  //   } else {
  //     setErrorMessage("Invalid email or password. Please try again.");
  //   }
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   setLoginDetails({ email: "", password: "" });
  //   setSemester("");
  //   setSubjects([]);
  //   setModules([]);
  //   setIsDataFetched(false);
  //   setErrorMessage("");
  // };

  // Fetch subjects based on branch and semester
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/subjects`, {
        params: { branch: hodBranch, semester },
      });
      setSubjects(response.data);
      setIsDataFetched(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setErrorMessage("Failed to fetch subjects. Please try again.");
    }
  };
  

  const fetchModules = async (subjectName) => {
    try {
      const response = await axios.get(`${baseUrl}/api/unit`, {
        params: { branch: newSubject.branch, semester, subject: subjectName },
      });
      setModules(response.data); // Update modules
      setErrorMessage(""); // Clear error
    } catch (error) {
      console.error("Error fetching modules:", error);
      setErrorMessage("Failed to fetch modules. Please try again.");
    }
  };


  const handleShowSubjects = () => {
    if (!semester) {
      setErrorMessage("Please select a semester to continue.");
      return;
    }
    fetchSubjects();
    setIsAddSubjectVisible(true);
  };
  

  const deleteSubject = async (subjectId) => {
    try {
      await axios.delete(`${baseUrl}/api/subjects/${subjectId}`);
      setSubjects(subjects.filter((subject) => subject.id !== subjectId)); // Remove deleted subject from state
      setErrorMessage(""); // Clear error
    } catch (error) {
      console.error("Error deleting subject:", error);
      setErrorMessage("Failed to delete subject. Please try again.");
    }
  };

  const deleteUnit = async (unitId) => {
    try {
      await axios.delete(`${baseUrl}/api/unit/${unitId}`);
      setModules(modules.filter((module) => module.id !== unitId)); // Remove deleted unit from state
      setErrorMessage(""); // Clear error
    } catch (error) {
      console.error("Error deleting unit:", error);
      setErrorMessage("Failed to delete unit. Please try again.");
    }
  };

  const handlePdfUpload = async (e) => {
    const fileInput = e.target;
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Save the file in the state
      setIsUploading(true); 
      setIsPdfUploaded(false); // Reset upload status
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${baseUrl}/api/uploadPdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fileInput.value = ''; // Log the response to see if PDF is uploaded successfully

        setPdfLink(response.data.pdfLink); // Save the PDF link
        setIsPdfUploaded(true); // Mark as successfully uploaded
      } catch (error) {
        console.error("Error uploading PDF:", error);
        setErrorMessage("Failed to upload PDF. Please try again.");
        fileInput.value = '';
      }
      finally{
        setIsUploading(false); 
      }
    }
  };




  const addUnit = async () => {
    if (!isPdfUploaded) {
      setErrorMessage("Please upload the PDF before adding a unit.");
      return;
    }

    try {
      const unitData = {
        branch: newSubject.branch,
        semester,
        subject: selectedSubject.subject,
        moduleNo,
        moduleName,
        pdfLink,
      };
      const response = await axios.post(`${baseUrl}/api/unit`, unitData);
      setModules([...modules, response.data]); // Update modules state with newly added unit

      // Clear inputs and state
      setModuleNo("");
      setModuleName("");
      setPdfLink("");
      setSelectedFile(null); // Clear the selected file
      setIsPdfUploaded(false); // Reset upload status
      setErrorMessage(""); // Clear error
    } catch (error) {
      console.error("Error adding unit:", error);
      setErrorMessage("Failed to add unit. Please try again.");
    }
  };


  const handleMoreClick = (subject) => {
    if (selectedSubject === subject) {
      setDropdownVisible(!dropdownVisible); // Toggle visibility
    } else {
      setSelectedSubject(subject);
      setDropdownVisible(true); // Show dropdown when a new subject is clicked
      fetchModules(subject.subject); // Use 'subject.subject' to fetch modules
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    
    if (!newSubject.subject) {
      setErrorMessage("Please enter a subject name.");
      return;
    }
  
    if (!semester) {
      setErrorMessage("Please select a semester before adding a subject.");
      return;
    }
  
    try {
      const response = await axios.post(`${baseUrl}/api/subjects`, {
        branch: newSubject.branch,
        semester: semester,  // <-- Ensure semester is included
        subject: newSubject.subject,
      });
  
      setSubjects([...subjects, response.data]); // Update state with the new subject
      setNewSubject({ branch: newSubject.branch, semester, subject: '' });
      setErrorMessage(""); // Clear error message
      setIsAddSubjectVisible(true);
    } catch (error) {
      console.error("Error adding subject:", error);
      setErrorMessage("Failed to add subject. Please try again.");
    }
  };
  

  return (
    <div className="note-container">
      {(
        <div>
          <div className="note-admin-panel">
  <span className="note-admin-title">NOTES PAGE</span>
  {hodBranch && <span className="note-hod-branch">Branch: {hodBranch}</span>}
</div>


          <div className="semester-container">
            <h2 className="semester-title">Select Semester</h2>
            <div className="semester-buttons">
              {['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5'].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSemester(sem)}
                  className={`semester-button ${semester === sem ? "selected" : ""}`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleShowSubjects} className="show-subjects-btn">
              Show Subjects
            </button>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {isDataFetched && (
            <div className="subjects-container">
              <h2 className="subjects-title">Available Subjects</h2>
              <ul className="subjects-list">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <li key={subject.id} className="subject-item">
                      {subject.subject}
                      <button
                        onClick={() => handleMoreClick(subject)}
                        className="subject-more-btn"
                      >
                        More
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="noteslogin-delete-unit-btn"
                      >
                        Delete
                      </button>
                      {selectedSubject === subject && dropdownVisible && (
                        <div className="module-dropdown">
                          <h3>Modules for {subject.subject}</h3>
                          <table className="module-table">
                            <thead>
                              <tr>
                                <th>Module No</th>
                                <th>Module Name</th>
                                <th>PDF Link</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {modules.length > 0 ? (
                                modules.map((module, index) => (
                                  <tr key={index}>
                                    <td>{module.moduleNo}</td>
                                    <td>{module.moduleName}</td>
                                    <td>
                                      <a
                                        href={module.pdfLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View PDF
                                      </a>
                                    </td>
                                    <td>
                                      <button
                                        onClick={() => deleteUnit(module.id)}
                                        className="noteslogin-delete-unit-btn"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4">No modules found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {/* Add Unit Form */}
                          <div className="add-unit-form">
                            <h4>Add New Unit</h4>
                            <input
                              type="text"
                              placeholder="Module No"
                              value={moduleNo}
                              onChange={(e) => setModuleNo(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Module Name"
                              value={moduleName}
                              onChange={(e) => setModuleName(e.target.value)}
                            />
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handlePdfUpload} // Use handlePdfUpload here
                              required
                            />
                            {selectedFile && <p>Selected File: {selectedFile.name}</p>} {/* Display file name */}
                            <button
                              onClick={addUnit}
                              className="add-unit-btn"
                              disabled={!isPdfUploaded || !moduleNo || !moduleName || isUploading} // Disable if PDF not uploaded or fields are empty
                            >
                             {isUploading ? "Uploading..." : "Add Unit"}
                            </button>
                            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}
                          </div>

                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <div>No subjects available</div>
                )}
              </ul>
            </div>
          )}

          {isAddSubjectVisible && (
            <div className="add-subject-form">
              <form onSubmit={handleAddSubject}>
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={newSubject.subject}
                  onChange={(e) => setNewSubject({ ...newSubject, subject: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Branch"
                  value={newSubject.branch} // Set branch from logged-in user
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Semester"
                  value={semester} // Ensure semester is set here
                  readOnly
                />
                <button type="submit" className="add-subject-btn">
                  Add Subject
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesAdmin;
