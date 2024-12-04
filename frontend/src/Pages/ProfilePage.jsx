import "../Styles/ProfilePage.css";

const ProfilePage = () => {
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
                                            <h4>Oleksandr Vasyliv</h4>
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
                                            <input type="text" className="form-control" value="Oleksandr Vasyliv" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value="vasyliv77@gmail.com" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Phone</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value="099 456 7876" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Address</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value="Lviv, street SomeStreet, 12" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3"></div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="button" className="btn btn-primary px-4" value="Save Changes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-sm-12">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="d-flex align-items-center mb-3">Study Status</h5>
                                            <p>Javascript</p>
                                            <div className="progress mb-3" style={{ height: '5px' }}>
                                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <p>C#</p>
                                            <div className="progress mb-3" style={{ height: '5px' }}>
                                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <p>Python</p>
                                            <div className="progress mb-3" style={{ height: '5px' }}>
                                                <div className="progress-bar bg-success" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
											<p>Sql</p>
                                            <div className="progress mb-3" style={{ height: '5px' }}>
                                                <div className="progress-bar bg-info" role="progressbar" style={{ width: '91%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
											<p>Java</p>
                                            <div className="progress mb-3" style={{ height: '5px' }}>
                                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: '74%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
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
