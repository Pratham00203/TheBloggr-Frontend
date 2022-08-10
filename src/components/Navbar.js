import hamburgerIcon from "../images/icons8-hamburger-menu-60.png";
import closeIcon from "../images/close.png";
import defaultProfileIcon from "../images/profile.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className='d-flex align-center'>
      <Link to='/home'>TheBloggr.</Link>
      <img
        src={hamburgerIcon}
        onClick={() => setShowMenu(!showMenu)}
        className='hamburger'
        alt=''
      />
      <ul
        className={
          showMenu ? "d-flex align-center show-menu" : "d-flex align-center"
        }>
        <img
          src={closeIcon}
          onClick={() => setShowMenu(!showMenu)}
          className='menu-close'
          alt=''
        />
        <li>
          <Link to='/home'>Home</Link>
        </li>
        <li>
          <Link to='/my-feed'>My Feed</Link>
        </li>
        <li>
          <Link to='/create-blog'>Create a Blog</Link>
        </li>
        <li>
          <Link to='/dashboard'>Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
}
