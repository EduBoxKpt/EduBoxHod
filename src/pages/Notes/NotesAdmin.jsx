import axios from "axios";
import "./NotesAdmin.css";
import React, { useState, useEffect } from "react";

const NotesAdmin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAddSubjectVisible, setIsAddSubjectVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [moduleNo, setModuleNo] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [pdfLink, setPdfLink] = useState("");

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
      setModules(response.data);
      setErrorMessage("");
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
      setSubjects(subjects.filter((subject) => subject.id !== subjectId));
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting subject:", error);
      setErrorMessage("Failed to delete subject. Please try again.");
    }
  };

  const deleteUnit = async (unitId) => {
    try {
      await axios.delete(`${baseUrl}/api/unit/${unitId}`);
      setModules(modules.filter((module) => module.id !== unitId));
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting unit:", error);
      setErrorMessage("Failed to delete unit. Please try again.");
    }
  };

  const handlePdfUpload = async (e) => {
    const fileInput = e.target;
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      setIsPdfUploaded(false);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${baseUrl}/api/uploadPdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fileInput.value = '';
        setPdfLink(response.data.pdfLink);
        setIsPdfUploaded(true);
      } catch (error) {
        console.error("Error uploading PDF:", error);
        setErrorMessage("Failed to upload PDF. Please try again.");
        fileInput.value = '';
      } finally {
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
      setModules([...modules, response.data]);

      setModuleNo("");
      setModuleName("");
      setPdfLink("");
      setSelectedFile(null);
      setIsPdfUploaded(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding unit:", error);
      setErrorMessage("Failed to add unit. Please try again.");
    }
  };

  const handleMoreClick = (subject) => {
    if (selectedSubject === subject) {
      setDropdownVisible(!dropdownVisible);
    } else {
      setSelectedSubject(subject);
      setDropdownVisible(true);
      fetchModules(subject.subject);
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
        semester: semester,
        subject: newSubject.subject,
      });

      setSubjects([...subjects, response.data]);
      setNewSubject({ branch: newSubject.branch, semester, subject: '' });
      setErrorMessage("");
      setIsAddSubjectVisible(true);
    } catch (error) {
      console.error("Error adding subject:", error);
      setErrorMessage("Failed to add subject. Please try again.");
    }
  };

  return (
    <div className="note-container">
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
          <table className="subjects-table">
  <tbody>
    {subjects.length > 0 ? (
      subjects.map((subject) => (
        <React.Fragment key={subject.id}>
          <tr className="subject-row">
            <td>{subject.subject}</td>
            <td>
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
            </td>
          </tr>

          {selectedSubject === subject && dropdownVisible && (
            <tr>
              <td colSpan="2">
                <div className="module-dropdown">
                  <h3>Study Material for {subject.subject}</h3>
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th>Number</th>
                        <th>Name</th>
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

                  <div className="add-unit-form">
                    <h4>Add New Module</h4>
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
                      onChange={handlePdfUpload}
                      required
                    />
                    {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                    <button
                      onClick={addUnit}
                      className="add-unit-btn"
                      disabled={!isPdfUploaded || !moduleNo || !moduleName || isUploading}
                    >
                      {isUploading ? "Uploading..." : "Add Unit"}
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                  </div>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))
    ) : (
      <tr>
        <td colSpan="2">
          <div>No subjects available</div>
        </td>
      </tr>
    )}
  </tbody>
</table>

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
              value={newSubject.branch}
              readOnly
            />
            <input
              type="text"
              placeholder="Semester"
              value={semester}
              readOnly
            />
            <button type="submit" className="add-subject-btn">
              Add Subject
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NotesAdmin;
