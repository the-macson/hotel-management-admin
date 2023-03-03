import React from 'react'
import '../css/navbar.css'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid nav-content">
            <Link to="/" className="navbar-brand">
              Hotel Booking
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="d-flex collapse navbar-collapse" id="navbarText">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
              </ul>
              <div className="navbar-text">
                <Link className='text-decoration-none' to="/book-room"> Book Room </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
}

export default Navbar