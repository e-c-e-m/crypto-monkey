import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../images/crypto-monkey.png';



const Menu = () => {
    return (
        <div className="header">
            <Link to={"/"}>
                <img className="menu-logo" src={Logo} alt={"logo"} />
            </Link>
        </div>
    )
}

export default Menu;
