import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

function Header(props) {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-bar">
      <Link to="/" className="link-decor">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="nav-logo"
          className="nav-logo"
        />
      </Link>

      <ul className="login-mobile-routes">
        <Link to="/" className="link-decor">
          <AiFillHome className="logout-logo" />
        </Link>
        <Link to="/jobs" className="link-decor">
          <BsBriefcaseFill className="logout-logo" />
        </Link>
        <FiLogOut className="logout-logo" onClick={onClickLogout} />
      </ul>

      <ul className="login-routes">
        <Link to="/" className="link-decor">
          <li className="nav-item">Home</li>
        </Link>
        <Link to="/jobs" className="link-decor">
          <li className="nav-item">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="logout-button" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
