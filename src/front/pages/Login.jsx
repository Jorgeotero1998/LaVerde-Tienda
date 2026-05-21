import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.

export const Login = () => {
    // Access the global state and dispatch function using the useGlobalReducer hook.
    const { store, dispatch } = useGlobalReducer()

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="login-form col-12 col-sm-6 col-md-4 bg-white rounded">
                <div className="row">
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                        <Link to="/" className="fs-6 d-flex text-decoration-none align-self-start mb-5 mt-3 ms-5 text-primary-emphasis">
                            <div className="icono rounded rounded-circle border border-1 border-primary mx-2">
                                <i className="fa-solid fa-angle-left px-2"></i>
                            </div>
                            Return home
                        </Link>

                        <h4 className="text-uppercase my-4 text-primary-emphasis">LogIn</h4>
                        <div className="col-8">
                            <p className="col-12 mb-4 border-1 border-bottom border-primary-subtle">
                                <i className="ms-1 fa-regular fa-user fa-1x text-secondary"></i>
                                <input type="email" placeholder="Type your Username or email"
                                    className="col-11 px-3 border-0 text-primary-emphasis" />
                            </p>
                            <p className="col-12 mb-2 border-1 border-bottom border-primary-subtle">
                                <i className="ms-1 fa-solid fa-unlock fa-1x text-secondary"></i>
                                <input type="password" placeholder="Type your Password"
                                    className="col-11 px-3 border-0 text-primary-emphasis" />
                            </p>
                        </div>
                        <div className="col-8 d-flex flex-column">
                            <Link to="/" className="d-flex align-self-end text-primary fw-bold">
                                Forgot Password?
                            </Link>
                        </div>
                        <button className="mt-4 mb-5 px-5 py-2 border-0 shadow btn btn-primary text-white">
                            Let's Go
                        </button>
                        <div className="col-8 d-flex flex-column justify-content-center align-items-center">
                            <p className="mx-auto">
                                Or sign up Using
                            </p>
                        </div>
                        <div className="mb-5">
                            <button className="btn btn-primary border-primary-subtle shadow rounded-pill mx-2 px-2 py-1" id="fButton">
                                <span className="text-primary">.</span><i className="fa-brands fa-facebook-f fa-2x"></i><span className="text-primary">.</span>
                            </button>
                            <button className="btn btn-dark border-dark-subtle shadow rounded-pill mx-2 p-1" id="xButton">
                                <i className="fa-brands fa-x-twitter fa-2x"></i>
                            </button>
                            <button className="btn btn-danger border-danger-subtle shadow rounded-pill mx-2 p-1" id="gButton">
                                <i className="fa-brands fa-google fa-2x"></i>
                            </button>
                        </div>




                    </div>
                </div>
            </div>

        </div >
    );
};
