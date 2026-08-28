import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";


function Hero({
  user,
  onNavigate
}) {

  // ========================================
  // STATE
  // ========================================

  const [subjects, setSubjects] =
    useState([]);

  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [subjectsError, setSubjectsError] =
    useState("");


  // ========================================
  // TODAY
  // ========================================

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric"
      }
    ).toUpperCase();

  // ========================================
  // DYNAMIC GREETING
  // ========================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };


    
  // ========================================
  // GET SUBJECTS FROM MONGODB
  // ========================================

  const loadSubjects = async () => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      setSubjects([]);

      setLoadingSubjects(false);

      return;
    }


    try {

      setLoadingSubjects(true);

      setSubjectsError("");


      const response =
        await fetch(
          `${API_URL}/api/subjects`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      // ====================================
      // SESSION EXPIRED
      // ====================================

      if (response.status === 401) {

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


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load courses."
        );
      }


      // ====================================
      // STORE REAL SUBJECTS
      // ====================================

      setSubjects(
        data.subjects || []
      );

    } catch (error) {

      console.error(
        "Home subjects error:",
        error
      );

      setSubjectsError(
        error.message ||
        "Unable to load courses."
      );

    } finally {

      setLoadingSubjects(false);
    }
  };


  // ========================================
  // LOAD SUBJECTS WHEN HOME OPENS
  // ========================================

  useEffect(() => {

    loadSubjects();

  }, []);


  // ========================================
  // CALCULATE SUBJECT PROGRESS
  // ========================================

  const getSubjectProgress = (
    subject
  ) => {

    const chapters =
      subject.chapters || [];


    if (chapters.length === 0) {
      return 0;
    }


    const completedChapters =
      chapters.filter(
        (chapter) =>
          chapter.completed
      ).length;


    return Math.round(
      (
        completedChapters /
        chapters.length
      ) * 100
    );
  };


  // ========================================
  // GET CHAPTER COUNT
  // ========================================

  const getChapterText = (
    subject
  ) => {

    const count =
      subject.chapters?.length || 0;


    return `${count} ${
      count === 1
        ? "chapter"
        : "chapters"
    }`;
  };


  // ========================================
  // GET SUBJECT INITIALS
  // ========================================

  const getSubjectInitials = (
    name
  ) => {

    if (!name) {
      return "S";
    }


    const words =
      name
        .trim()
        .split(/\s+/);


    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }


    return (
      words[0].charAt(0) +
      words[1].charAt(0)
    ).toUpperCase();
  };


  // ========================================
  // USER NAME
  // ========================================

  const userName =
    user?.name || "Student";


  // ========================================
  // RENDER
  // ========================================

  return (

    <section
      className="hero-section"
      id="home"
    >

      {/* ====================================
          WELCOME SECTION
      ==================================== */}

      <div className="welcome">

        <div>

          <p className="small-heading">
            {today}
          </p>


          <h1>
            {getGreeting()}, {userName} ◝(ᵔᵕᵔ)◜✰
          </h1>


          <p className="welcome-text">
            Stay focused and keep making
            progress toward your goals.
          </p>

        </div>

      </div>


      {/* ====================================
          COURSE OVERVIEW
      ==================================== */}

      <div
        className="course-overview"
        id="courses"
      >

        <div className="section-heading">

          <div>

            <h2>
              Course Overview
            </h2>

            <p>
              Your current courses
            </p>

          </div>


          <button
            type="button"
            className="view-button"
            onClick={() =>
              onNavigate("/courses")
            }
          >
            View all
          </button>

        </div>


        {/* ==================================
            LOADING
        ================================== */}

        {loadingSubjects && (

          <div className="home-data-message">

            Loading courses...

          </div>

        )}


        {/* ==================================
            ERROR
        ================================== */}

        {!loadingSubjects &&
          subjectsError && (

          <div className="home-data-error">

            {subjectsError}

          </div>

        )}


        {/* ==================================
            EMPTY STATE
        ================================== */}

        {!loadingSubjects &&
          !subjectsError &&
          subjects.length === 0 && (

          <div className="home-empty-courses">

            <h3>
              No subjects yet.
            </h3>

            <p>
              Add your first subject to
              start tracking your study progress.
            </p>


            <button
              type="button"
              className="view-button"
              onClick={() =>
                onNavigate("/courses")
              }
            >
              + Add Subject
            </button>

          </div>

        )}


        {/* ==================================
            REAL SUBJECTS
        ================================== */}

        {!loadingSubjects &&
          !subjectsError &&
          subjects.length > 0 && (

          <div className="course-grid">

            {subjects.map(
              (subject) => {

                const progress =
                  getSubjectProgress(
                    subject
                  );


                return (

                  <div
                    className="course-card"
                    key={subject._id}
                  >

                    {/* SUBJECT ICON */}

                    <div className="course-icon">

                      {getSubjectInitials(
                        subject.name
                      )}

                    </div>


                    {/* SUBJECT INFORMATION */}

                    <div>

                      <h3>
                        {subject.name}
                      </h3>


                      <p>
                        {getChapterText(
                          subject
                        )}
                      </p>


                      {/* PROGRESS BAR */}

                      <div className="progress">

                        <div
                          className="progress-fill"
                          style={{
                            width:
                              `${progress}%`
                          }}
                        />

                      </div>


                      {/* PROGRESS TEXT */}

                      <small>
                        {progress}% completed
                      </small>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </section>
  );
}


export default Hero;