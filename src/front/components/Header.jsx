import { Link } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* <!-- Left side navBar --> */}
                    <Link to="/">
                        <i className="fa-solid fa-store fa-3x text-light"></i>
                    </Link>


                    {/* <!-- Right side navBar --> */}
                    {/* Collapse option */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item mb-2 mb-lg-0">
                                <button
                                    className="btn btn-outline-secondary mx-2"
                                    type="button"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                                <button
                                    className="btn btn-outline-secondary mx-2"
                                    type="button"
                                >
                                    0
                                    <i className="ms-2 fa-solid fa-cart-shopping"></i>
                                </button>

                                <button
                                    className="btn btn-outline-secondary dropdown-toggle ms-2"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-lg-end">
                                    <li><a className="dropdown-item" href="#">Productos</a></li>
                                    <li>
                                        <a className="dropdown-item" href="#">Ofertas</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">Contacto</a>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link to="/login" className="dropdown-item text-primary">
                                            Login
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );

    // return (
    //     <header className="bg-dark text-white p-3 position-relative">

    //         <div className="d-flex justify-content-between align-items-center">

    //             {/* IZQUIERDA */}
    //             <div className="position-relative">

    //                 <button
    //                     className="btn btn-dark fs-4"
    //                     onClick={() => setMenuOpen(!menuOpen)}
    //                 >
    //                     ☰
    //                 </button>

    //                 {menuOpen && (
    //                     <div
    //                         className="position-absolute bg-white rounded shadow mt-2"
    //                         style={{ minWidth: "200px", zIndex: 1000 }}
    //                     >
    //                         <a href="#" className="dropdown-item">
    //                             Inicio
    //                         </a>

    //                         <a href="#" className="dropdown-item">
    //                             Productos
    //                         </a>

    //                         <a href="#" className="dropdown-item">
    //                             Ofertas
    //                         </a>

    //                         <a href="#" className="dropdown-item">
    //                             Contacto
    //                         </a>
    //                     </div>
    //                 )}

    //             </div>

    //             {/* CENTRO */}
    //             <div className="position-absolute start-50 translate-middle-x">
    //                 <h3 className="m-0">
    //                     Mi Tienda
    //                 </h3>
    //             </div>

    //             {/* DERECHA */}
    //             <div className="d-flex gap-2">

    //                 <button className="btn btn-outline-light">
    //                     🔍
    //                 </button>

    //                 <button className="btn btn-light">
    //                     Login
    //                 </button>

    //             </div>

    //         </div>

    //     </header>
    // );
};