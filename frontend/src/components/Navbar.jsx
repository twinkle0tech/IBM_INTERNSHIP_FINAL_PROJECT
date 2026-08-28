function Navbar({
  user,
  currentPath,
  onNavigate,
  onLogout
}) {

  const firstLetter =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() || "U";


  const navigationItems = [
    {
      path: "/",
      icon: "⌂",
      label: "Home"
    },
    {
      path: "/courses",
      icon: "▣",
      label: "Courses"
    },
    {
      path: "/schedule",
      icon: "◷",
      label: "Schedule"
    },
    {
      path: "/assignments",
      icon: "✓",
      label: "Assignments"
    },
    {
      path: "/todos",
      icon: "▤",
      label: "Todo List"
    },
    {
      path: "/exams",
      icon: "▥",
      label: "Exams"
    }
  ];


  const handleNavigation = (
    event,
    path
  ) => {

    event.preventDefault();

    onNavigate(path);
  };


  return (

    <aside className="sidebar">

      {/* ==================================
          USER PROFILE
      ================================== */}

      <div className="profile">

        {user?.profileImage ? (

          <img
            src={user.profileImage}
            alt="Profile"
            className="profile-avatar profile-avatar-image"
          />

        ) : (

          <div className="profile-avatar">
            {firstLetter}
          </div>

        )}


        <div>

          <h3>
            {user?.name || "Student"}
          </h3>

          <p>
            Student
          </p>

        </div>

      </div>


      {/* ==================================
          NAVIGATION
      ================================== */}

      <nav className="side-nav">

        <p className="nav-title">
          MENU
        </p>


        {navigationItems.map(
          (item) => (

            <a
              key={item.path}
              href={item.path}
              className={
                currentPath === item.path ||
                (
                  item.path === "/" &&
                  currentPath === "/home"
                )
                  ? "active"
                  : ""
              }
              onClick={(event) =>
                handleNavigation(
                  event,
                  item.path
                )
              }
            >

              <span>
                {item.icon}
              </span>

              {item.label}

            </a>

          )
        )}


        {/* ==================================
            ACCOUNT
        ================================== */}

        <p className="nav-title bottom-title">
          ACCOUNT
        </p>


        <a
          href="/settings"
          className={
            currentPath === "/settings"
              ? "active"
              : ""
          }
          onClick={(event) =>
            handleNavigation(
              event,
              "/settings"
            )
          }
        >

          <span>
            ⚙
          </span>

          Profile

        </a>


        {/* ==================================
            DARK MODE
        ================================== */}

        <button
          type="button"
          className="nav-link-button"
          onClick={() =>
            document.body.classList.toggle(
              "dark-mode"
            )
          }
        >

          <span>
            ☾
          </span>

          Dark Mode

        </button>


        {/* ==================================
            LOGOUT
        ================================== */}

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >

          <span>
            ↪
          </span>

          Logout

        </button>

      </nav>

    </aside>
  );
}

export default Navbar;