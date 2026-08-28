import { useRef, useState } from "react";

const API_URL = "http://localhost:5000";

function Settings({ user, onUserUpdate }) {
  const fullName = user?.name || "Dianne Russell";
  const nameParts = fullName.split(" ");
  const initialFirstName = nameParts.shift() || "Dianne";
  const initialLastName = nameParts.join(" ") || "Russell";
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(user?.email || "russell@hey.com");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const profileName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName?.charAt(0)?.toUpperCase() || "D"}${lastName?.charAt(0)?.toUpperCase() || "R"}`;

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: profileName, email, password: passwordEnabled ? password : "", profileImage })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save your profile.");
      onUserUpdate(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setPassword("");
      setPasswordEnabled(false);
      setStatus("Profile saved successfully.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const savedParts = (user?.name || "Dianne Russell").split(" ");
    setFirstName(savedParts.shift() || "Dianne");
    setLastName(savedParts.join(" ") || "Russell");
    setEmail(user?.email || "russell@hey.com");
    setProfileImage(user?.profileImage || "");
    setPassword("");
    setPasswordEnabled(false);
    setStatus("");
    setError("");
  };

  return (
    <div className="settings-page">
      <div className="account-panel">
        <header className="account-header">
          <button className="icon-button" type="button" aria-label="Go back" onClick={() => window.history.back()}>
            ‹
          </button>

          <div className="account-header-user">
            {profileImage ? <img src={profileImage} alt="Profile" className="header-avatar profile-avatar-image" /> : <span className="header-avatar">{initials}</span>}
            <span className="header-name">{profileName}</span>
          </div>
        </header>

        <div className="account-body">
          <aside className="account-sidebar">
            <div className="sidebar-section">
              <button type="button" className="side-link active">
                <span className="side-icon">◉</span>
                Profile
              </button>
             
            </div>
          </aside>

          <main className="account-content">
            <div className="profile-section-title">Profile Picture</div>

            <div className="profile-picture-row">
              {profileImage ? <img src={profileImage} alt="Profile" className="profile-picture large-avatar" /> : <div className="profile-picture large-avatar">{initials}</div>}

              <div className="profile-actions">
                <input ref={fileInputRef} type="file" accept="image/*" className="file-input" onChange={handleImageChange} />
                <button type="button" className="primary-action upload-btn" onClick={() => fileInputRef.current?.click()}>
                  Upload Image
                </button>
                <button type="button" className="text-action" onClick={() => { setProfileImage(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                  Remove
                </button>
              </div>
            </div>

            <form onSubmit={handleSave}>
            <div className="split-fields">
              <div className="field-group">
                <label>First Name</label>
                <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
              </div>

              <div className="field-group">
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
              </div>
            </div>

            <div className="field-group">
              <label>Email</label>
              <div className="input-button-wrap">
                <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <button type="button" className="inline-button" onClick={() => document.getElementById("profile-email")?.focus()}>Edit Email</button>
              </div>
            </div>

            <div className="field-group password-row">
              <label>Password</label>
              <div className="input-button-wrap">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={passwordEnabled ? "Enter a new password" : "Password unchanged"} disabled={!passwordEnabled} minLength={passwordEnabled ? 6 : undefined} />
                {passwordEnabled ? <button type="button" className="inline-button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide Password" : "Show Password"}</button> : <button type="button" className="inline-button" onClick={() => setPasswordEnabled(true)}>Change Password</button>}
              </div>
            </div>

            {error && <div className="settings-message settings-error">{error}</div>}
            {status && <div className="settings-message settings-success">{status}</div>}
            <div className="form-footer">
              <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="save-button" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Settings;