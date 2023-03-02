import React from 'react'
import '../css/navbar.css'
import { Link } from 'react-router-dom';

const Navbar = () => {
    function updatemenu() {
        if (document.getElementById('responsive-menu').checked === true) {
            document.getElementById('menu').style.borderBottomRightRadius = '0';
            document.getElementById('menu').style.borderBottomLeftRadius = '0';
        }else{
            document.getElementById('menu').style.borderRadius = '0px';
        }
    }
    return (
        <div className='nav mb-3'>
            <nav className="container">
                <nav id='menu'>
                    <input type='checkbox' id='responsive-menu' onClick={updatemenu}/><label></label>
                    <ul>
                        <li>
                            <Link to="/"> Home </Link>
                        </li>
                        <li className='float-end'>
                            <Link to="/book-room"> Book Room </Link>
                        </li>
                    </ul>
                </nav>
            </nav>
        </div>
    )
}

export default Navbar