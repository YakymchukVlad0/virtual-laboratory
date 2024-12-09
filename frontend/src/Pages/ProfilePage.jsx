import React, { useState, useEffect } from "react";
import "../Styles/ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    studyStatus: {
      Javascript: 0,
      Csharp: 0,
      Python: 0,
      Sql: 0,
      Java: 0,
    },
  });

  useEffect(() => {
    // Отримуємо дані з localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUserData((prevState) => ({
        ...prevState,
        fullName: parsedUser.username || "",
        email: parsedUser.email || "",
      }));
    }
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="main-body">
          <div className="row">
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar6.png"
                      alt="Admin"
                      className="rounded-circle p-1 bg-primary"
                      width="150"
                    />
                    <div className="mt-3">
                      <h4>{userData.fullName || "Student Name"}</h4>
                      <p className="text-secondary mb-1">Programming engineer student</p>
                      <p className="text-muted font-size-sm">Lviv, Ukraine</p>
                      <button className="btn btn-outline-primary">Message</button>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">Github</h6>
                      <span className="text-secondary">example.github.com</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">Instagram</h6>
                      <span className="text-secondary">bootdey</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">Facebook</h6>
                      <span className="text-secondary">bootdey</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card h-100">
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Full Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={userData.fullName}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={userData.email}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Phone</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Address</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={userData.address}
                        onChange={(e) =>
                          setUserData({ ...userData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="button"
                        className="btn btn-primary px-4"
                        value="Save Changes"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-12">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="d-flex align-items-center mb-3">Study Status</h5>
                      {Object.entries(userData.studyStatus).map(
                        ([subject, progress]) => (
                          <React.Fragment key={subject}>
                            <p>{subject}</p>
                            <div
                              className="progress mb-3"
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${progress}%` }}
                                aria-valuenow={progress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
