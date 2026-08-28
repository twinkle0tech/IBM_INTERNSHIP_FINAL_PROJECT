import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


function Courses() {

  // ========================================
  // STATE
  // ========================================

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // Subject form
  const [showSubjectForm, setShowSubjectForm] =
    useState(false);

  const [editingSubjectId, setEditingSubjectId] =
    useState(null);

  const [subjectName, setSubjectName] =
    useState("");

  const [subjectDescription, setSubjectDescription] =
    useState("");


  // Chapter form
  const [chapterForm, setChapterForm] =
    useState(null);

  const [editingChapterId, setEditingChapterId] =
    useState(null);

  const [chapterTitle, setChapterTitle] =
    useState("");

  const [chapterDescription, setChapterDescription] =
    useState("");


  // Expanded subjects
  const [expandedSubjectId, setExpandedSubjectId] =
    useState(null);


  // ========================================
  // GET TOKEN
  // ========================================

  const getToken = () => {

    return localStorage.getItem("token");
  };


  // ========================================
  // API REQUEST HELPER
  // ========================================

  const apiRequest = async (
    url,
    options = {}
  ) => {

    const token = getToken();


    if (!token) {

      throw new Error(
        "Your session has expired. Please log in again."
      );
    }


    const response = await fetch(
      `${API_URL}${url}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {})
        }
      }
    );


    const data =
      await response.json();


    if (
      response.status === 401
    ) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      throw new Error(
        "Your session has expired. Please log in again."
      );
    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Something went wrong."
      );
    }


    return data;
  };


  // ========================================
  // LOAD SUBJECTS
  // ========================================

  const loadSubjects = async () => {

    setLoading(true);
    setError("");


    try {

      const data =
        await apiRequest(
          "/api/subjects"
        );


      setSubjects(
        data.subjects || []
      );

    } catch (error) {

      console.error(
        "Load subjects error:",
        error
      );

      setError(
        error.message ||
        "Unable to load subjects."
      );

    } finally {

      setLoading(false);
    }
  };


  // Load when page opens
  useEffect(() => {

    loadSubjects();

  }, []);


  // ========================================
  // CLEAR MESSAGES
  // ========================================

  const showSuccessMessage = (
    message
  ) => {

    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };


  // ========================================
  // OPEN ADD SUBJECT
  // ========================================

  const openAddSubject = () => {

    setEditingSubjectId(null);

    setSubjectName("");

    setSubjectDescription("");

    setShowSubjectForm(true);

    setError("");
  };


  // ========================================
  // OPEN EDIT SUBJECT
  // ========================================

  const openEditSubject = (
    subject
  ) => {

    setEditingSubjectId(
      subject._id
    );

    setSubjectName(
      subject.name
    );

    setSubjectDescription(
      subject.description || ""
    );

    setShowSubjectForm(true);

    setError("");
  };


  // ========================================
  // CLOSE SUBJECT FORM
  // ========================================

  const closeSubjectForm = () => {

    setShowSubjectForm(false);

    setEditingSubjectId(null);

    setSubjectName("");

    setSubjectDescription("");
  };


  // ========================================
  // SAVE SUBJECT
  // ========================================

  const handleSubjectSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (!subjectName.trim()) {

      setError(
        "Please enter a subject name."
      );

      return;
    }


    try {

      const isEditing =
        Boolean(editingSubjectId);


      const url = isEditing
        ? `/api/subjects/${editingSubjectId}`
        : "/api/subjects";


      const method = isEditing
        ? "PUT"
        : "POST";


      const data =
        await apiRequest(
          url,
          {
            method,

            body: JSON.stringify({
              name:
                subjectName.trim(),

              description:
                subjectDescription.trim()
            })
          }
        );


      if (isEditing) {

        setSubjects(
          (currentSubjects) =>
            currentSubjects.map(
              (subject) =>
                subject._id ===
                editingSubjectId
                  ? data.subject
                  : subject
            )
        );

        showSuccessMessage(
          "Subject updated successfully."
        );

      } else {

        setSubjects(
          (currentSubjects) => [
            data.subject,
            ...currentSubjects
          ]
        );

        showSuccessMessage(
          "Subject added successfully."
        );
      }


      closeSubjectForm();

    } catch (error) {

      console.error(
        "Save subject error:",
        error
      );

      setError(
        error.message ||
        "Unable to save subject."
      );
    }
  };


  // ========================================
  // DELETE SUBJECT
  // ========================================

  const handleDeleteSubject = async (
    subject
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${subject.name}"? This will also delete all of its chapters.`
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");


      await apiRequest(
        `/api/subjects/${subject._id}`,
        {
          method: "DELETE"
        }
      );


      setSubjects(
        (currentSubjects) =>
          currentSubjects.filter(
            (item) =>
              item._id !== subject._id
          )
      );


      if (
        expandedSubjectId ===
        subject._id
      ) {

        setExpandedSubjectId(null);
      }


      showSuccessMessage(
        "Subject deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete subject error:",
        error
      );

      setError(
        error.message ||
        "Unable to delete subject."
      );
    }
  };


  // ========================================
  // OPEN ADD CHAPTER
  // ========================================

  const openAddChapter = (
    subjectId
  ) => {

    setChapterForm(subjectId);

    setEditingChapterId(null);

    setChapterTitle("");

    setChapterDescription("");

    setError("");
  };


  // ========================================
  // OPEN EDIT CHAPTER
  // ========================================

  const openEditChapter = (
    subjectId,
    chapter
  ) => {

    setChapterForm(subjectId);

    setEditingChapterId(
      chapter._id
    );

    setChapterTitle(
      chapter.title
    );

    setChapterDescription(
      chapter.description || ""
    );

    setError("");
  };


  // ========================================
  // CLOSE CHAPTER FORM
  // ========================================

  const closeChapterForm = () => {

    setChapterForm(null);

    setEditingChapterId(null);

    setChapterTitle("");

    setChapterDescription("");
  };


  // ========================================
  // SAVE CHAPTER
  // ========================================

  const handleChapterSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (!chapterTitle.trim()) {

      setError(
        "Please enter a chapter title."
      );

      return;
    }


    try {

      const isEditing =
        Boolean(editingChapterId);


      const url = isEditing

        ? `/api/subjects/${chapterForm}/chapters/${editingChapterId}`

        : `/api/subjects/${chapterForm}/chapters`;


      const method = isEditing
        ? "PUT"
        : "POST";


      const data =
        await apiRequest(
          url,
          {
            method,

            body: JSON.stringify({
              title:
                chapterTitle.trim(),

              description:
                chapterDescription.trim()
            })
          }
        );


      // Replace the subject returned
      // from MongoDB.
      setSubjects(
        (currentSubjects) =>
          currentSubjects.map(
            (subject) =>
              subject._id ===
              chapterForm
                ? data.subject
                : subject
          )
      );


      closeChapterForm();


      showSuccessMessage(
        isEditing
          ? "Chapter updated successfully."
          : "Chapter added successfully."
      );

    } catch (error) {

      console.error(
        "Save chapter error:",
        error
      );

      setError(
        error.message ||
        "Unable to save chapter."
      );
    }
  };


  // ========================================
  // DELETE CHAPTER
  // ========================================

  const handleDeleteChapter = async (
    subjectId,
    chapter
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${chapter.title}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");


      const data =
        await apiRequest(
          `/api/subjects/${subjectId}/chapters/${chapter._id}`,
          {
            method: "DELETE"
          }
        );


      setSubjects(
        (currentSubjects) =>
          currentSubjects.map(
            (subject) =>
              subject._id === subjectId
                ? data.subject
                : subject
          )
      );


      showSuccessMessage(
        "Chapter deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete chapter error:",
        error
      );

      setError(
        error.message ||
        "Unable to delete chapter."
      );
    }
  };


  // ========================================
  // TOGGLE CHAPTER
  // ========================================

  const handleToggleChapter = async (
    subjectId,
    chapterId
  ) => {

    try {

      setError("");


      const data =
        await apiRequest(
          `/api/subjects/${subjectId}/chapters/${chapterId}/toggle`,
          {
            method: "PATCH"
          }
        );


      setSubjects(
        (currentSubjects) =>
          currentSubjects.map(
            (subject) =>
              subject._id === subjectId
                ? data.subject
                : subject
          )
      );

    } catch (error) {

      console.error(
        "Toggle chapter error:",
        error
      );

      setError(
        error.message ||
        "Unable to update chapter."
      );
    }
  };


  // ========================================
  // TOGGLE SUBJECT DETAILS
  // ========================================

  const toggleSubjectDetails = (
    subjectId
  ) => {

    setExpandedSubjectId(
      (currentId) =>
        currentId === subjectId
          ? null
          : subjectId
    );
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <section className="courses-page">

        <div className="courses-header">

          <div>

            <p className="small-heading">
              STUDY PLANNER
            </p>

            <h1>
              Courses
            </h1>

            <p>
              Manage your subjects and track your study progress.
            </p>

          </div>

        </div>


        <div className="courses-loading">
          Loading...
        </div>

      </section>
    );
  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <section className="courses-page">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="courses-header">

        <div>

          <p className="small-heading">
            STUDY PLANNER
          </p>

          <h1>
            Courses
          </h1>

          <p>
            Manage your subjects and track your study progress.
          </p>

        </div>


        <button
          type="button"
          className="add-button"
          onClick={openAddSubject}
        >
          + Add Subject
        </button>

      </div>


      {/* ====================================
          MESSAGES
      ==================================== */}

      {error && (

        <div className="courses-error">
          {error}
        </div>

      )}


      {success && (

        <div className="courses-success">
          {success}
        </div>

      )}


      {/* ====================================
          SUBJECT FORM
      ==================================== */}

      {showSubjectForm && (

        <div className="form-card">

          <div className="form-card-header">

            <h2>
              {editingSubjectId
                ? "Edit Subject"
                : "Add Subject"}
            </h2>

            <button
              type="button"
              className="close-button"
              onClick={closeSubjectForm}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={
              handleSubjectSubmit
            }
          >

            <label>
              Subject Name
            </label>

            <input
              type="text"
              placeholder="e.g. Data Structures"
              value={subjectName}
              onChange={(event) =>
                setSubjectName(
                  event.target.value
                )
              }
            />


            <label>
              Description
            </label>

            <textarea
              placeholder="Describe this subject..."
              value={subjectDescription}
              onChange={(event) =>
                setSubjectDescription(
                  event.target.value
                )
              }
              rows="4"
            />


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={closeSubjectForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingSubjectId
                  ? "Update Subject"
                  : "Save Subject"}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ====================================
          EMPTY STATE
      ==================================== */}

      {subjects.length === 0 && (

        <div className="empty-courses">

          <div className="empty-icon">
            +
          </div>

          <h2>
            No subjects yet.
          </h2>

          <p>
            Add your first subject to start
            tracking your study progress.
          </p>

          <button
            type="button"
            className="add-button"
            onClick={openAddSubject}
          >
            + Add Subject
          </button>

        </div>

      )}


      {/* ====================================
          SUBJECT CARDS
      ==================================== */}

      {subjects.length > 0 && (

        <div className="subjects-grid">

          {subjects.map(
            (subject) => {

              const totalChapters =
                subject.chapters?.length || 0;


              const completedChapters =
                subject.chapters
                  ?.filter(
                    (chapter) =>
                      chapter.completed
                  )
                  .length || 0;


              const progress =
                totalChapters === 0
                  ? 0
                  : Math.round(
                      (
                        completedChapters /
                        totalChapters
                      ) * 100
                    );


              const isExpanded =
                expandedSubjectId ===
                subject._id;


              return (

                <article
                  className="subject-card"
                  key={subject._id}
                >

                  {/* ======================
                      SUBJECT HEADER
                  ====================== */}

                  <div className="subject-card-top">

                    <div>

                      <h2>
                        {subject.name}
                      </h2>

                      <p>
                        {totalChapters}{" "}
                        {totalChapters === 1
                          ? "Chapter"
                          : "Chapters"}
                      </p>

                    </div>


                    <div className="subject-actions">

                      <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                          openEditSubject(
                            subject
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger-text-button"
                        onClick={() =>
                          handleDeleteSubject(
                            subject
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>


                  {/* ======================
                      DESCRIPTION
                  ====================== */}

                  {subject.description && (

                    <p className="subject-description">
                      {subject.description}
                    </p>

                  )}


                  {/* ======================
                      PROGRESS
                  ====================== */}

                  <div className="subject-progress-header">

                    <span>
                      Progress
                    </span>

                    <strong>
                      {progress}%
                    </strong>

                  </div>


                  <div className="subject-progress">

                    <div
                      className="subject-progress-fill"
                      style={{
                        width:
                          `${progress}%`
                      }}
                    />

                  </div>


                  <p className="chapter-count">

                    {completedChapters} of{" "}
                    {totalChapters} chapters
                    completed

                  </p>


                  {/* ======================
                      VIEW BUTTON
                  ====================== */}

                  <button
                    type="button"
                    className="view-subject-button"
                    onClick={() =>
                      toggleSubjectDetails(
                        subject._id
                      )
                    }
                  >

                    {isExpanded
                      ? "Hide Chapters"
                      : "View Chapters"}

                    <span>
                      {isExpanded
                        ? "↑"
                        : "↓"}
                    </span>

                  </button>


                  {/* ======================
                      CHAPTER DETAILS
                  ====================== */}

                  {isExpanded && (

                    <div className="chapter-section">

                      <div className="chapter-section-header">

                        <h3>
                          Chapters
                        </h3>

                        <button
                          type="button"
                          className="add-chapter-button"
                          onClick={() =>
                            openAddChapter(
                              subject._id
                            )
                          }
                        >
                          + Add Chapter
                        </button>

                      </div>


                      {/* CHAPTER FORM */}

                      {chapterForm ===
                        subject._id && (

                        <form
                          className="chapter-form"
                          onSubmit={
                            handleChapterSubmit
                          }
                        >

                          <h4>
                            {editingChapterId
                              ? "Edit Chapter"
                              : "Add Chapter"}
                          </h4>


                          <label>
                            Chapter Title
                          </label>

                          <input
                            type="text"
                            placeholder="e.g. Arrays"
                            value={
                              chapterTitle
                            }
                            onChange={(
                              event
                            ) =>
                              setChapterTitle(
                                event.target.value
                              )
                            }
                          />


                          <label>
                            Description
                          </label>

                          <textarea
                            placeholder="Describe this chapter..."
                            value={
                              chapterDescription
                            }
                            onChange={(
                              event
                            ) =>
                              setChapterDescription(
                                event.target.value
                              )
                            }
                            rows="3"
                          />


                          <div className="form-actions">

                            <button
                              type="button"
                              className="cancel-button"
                              onClick={
                                closeChapterForm
                              }
                            >
                              Cancel
                            </button>

                            <button
                              type="submit"
                              className="save-button"
                            >
                              {editingChapterId
                                ? "Update Chapter"
                                : "Save Chapter"}
                            </button>

                          </div>

                        </form>

                      )}


                      {/* CHAPTER LIST */}

                      {totalChapters === 0 ? (

                        <div className="no-chapters">
                          No chapters yet.
                        </div>

                      ) : (

                        <div className="chapter-list">

                          {subject.chapters.map(
                            (chapter) => (

                              <div
                                className={
                                  chapter.completed
                                    ? "chapter-item completed"
                                    : "chapter-item"
                                }
                                key={
                                  chapter._id
                                }
                              >

                                <button
                                  type="button"
                                  className="chapter-check"
                                  onClick={() =>
                                    handleToggleChapter(
                                      subject._id,
                                      chapter._id
                                    )
                                  }
                                  aria-label={
                                    chapter.completed
                                      ? "Mark incomplete"
                                      : "Mark complete"
                                  }
                                >
                                  {chapter.completed
                                    ? "✓"
                                    : "○"}
                                </button>


                                <div className="chapter-info">

                                  <h4>
                                    {chapter.title}
                                  </h4>

                                  {chapter.description && (

                                    <p>
                                      {
                                        chapter.description
                                      }
                                    </p>

                                  )}

                                </div>


                                <div className="chapter-actions">

                                  <button
                                    type="button"
                                    className="text-button"
                                    onClick={() =>
                                      openEditChapter(
                                        subject._id,
                                        chapter
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="danger-text-button"
                                    onClick={() =>
                                      handleDeleteChapter(
                                        subject._id,
                                        chapter
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  )}

                </article>

              );

            }
          )}

        </div>

      )}

    </section>
  );
}


export default Courses;