import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import logo from "../../images/logo.svg";
import { AiOutlineSearch } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { SlPlaylist } from "react-icons/sl";
import { MdRadio } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { ImVideoCamera } from "react-icons/im";
import { GoSignOut } from "react-icons/go";
import { useDispatch } from "react-redux";
import { logUser, setContract, setProvider } from "../../redux/audio"
import { web3Modal } from "../../utils/web3Utils";
import Web3 from "web3"
import { contractAbi, contractAddress } from "../../utils/constants";
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(true);
  const [connected, setConnected] = useState(false);
  const { pathname } = useLocation();
  const sideBar = useRef();
  const mobileNav = useRef();
  // const { owner } = useSelector((state) => state.audios);
  useEffect(() => {
    if (pathname.includes("profile") || pathname.includes("subscription") || pathname.includes("categories")) {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  }, [pathname])

  const menu = () => {
    mobileNav.current.classList.toggle("active");
    sideBar.current.classList.toggle("active");
  };

  const onsubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${e.target.q.value}`);
  };

  const removeMenu = () => {
    menu();
  }
  const checkIfConnected = async () => {
    if (web3Modal.cachedProvider) {
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      dispatch(setContract(contract));
      dispatch(setProvider(web3));
      setConnected(true);
      dispatch(logUser(account));
    }
  }
  useEffect(() => {
    checkIfConnected();
  }, [])

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      dispatch(setContract(contract));
      dispatch(setProvider(web3));
      setConnected(account);
      dispatch(logUser(account));
    } catch (error) {
      console.log(error);
    }
  }
  //
  const disconnect = async () => {
    web3Modal.clearCachedProvider();
    window.localStorage.clear("WEB3_CONNECT_CACHED_PROVIDER");
    setConnected(false);
  }

  return (
    <React.Fragment>
      <nav>
        <Link to="/">
          <img src={logo} alt="" className="logo" />
        </Link>
        {showSearch
          &&
          <>
            <form action="/search" onSubmit={onsubmit}>
              <input type="submit" id="submit" style={{ display: "none" }} />
              <label htmlFor="submit">
                <AiOutlineSearch />
              </label>
              <input type="text" placeholder="Search" name="q" />
            </form>
            {connected
              ?
              <button onClick={disconnect}>Disconnect</button>
              :
              <button onClick={connectWallet}>Connect</button>
            }
          </>
        }

      </nav>
      <aside>
        <ul>
          <NavLink to="/">
            <FiHome className="icon" />
          </NavLink>
          <NavLink to="Collections">
            <SlPlaylist className="icon" />
          </NavLink>
          <NavLink to="radio">
            <MdRadio className="icon" />
          </NavLink>
          <NavLink to="video">
            <ImVideoCamera className="icon" />
          </NavLink>
        </ul>
        <ul>
          <NavLink to="/profile/">
            <CiUser className="icon" />
          </NavLink>
          <a href="/">
            <GoSignOut className="icon" />
          </a>
        </ul>
      </aside>
      <div className="mobileNav" ref={mobileNav}>
        <div className="bars" onClick={menu}>
          <span></span>
          <span></span>
        </div>
        <Link to="/">
          <img src={logo} alt="" className="logo" />
        </Link>
        {showSearch
          &&
          <form action="/search" onSubmit={onsubmit}>
            <input type="text" placeholder="Search" name="q" />
            <input type="submit" id="submit" style={{ display: "none" }} />
            <label htmlFor="submit">
              <AiOutlineSearch />
            </label>
          </form>
        }
      </div>
      <ul className="sideBar" ref={sideBar}>
        <NavLink onClick={removeMenu} to="/">
          <FiHome className="icon" /><span>Home</span>
        </NavLink>
        <NavLink onClick={removeMenu} to="Collections">
          <SlPlaylist className="icon" />
          <span>My collections</span>
        </NavLink>
        <NavLink onClick={removeMenu} to="radio">
          <MdRadio className="icon" />
          <span>Radio</span>
        </NavLink>
        <NavLink onClick={removeMenu} to="video">
          <ImVideoCamera className="icon" />
          <span>Music video</span>
        </NavLink>
        <NavLink onClick={removeMenu} to="profile/">
          <CiUser className="icon" />
          <span>Profile</span>
        </NavLink>
        <a onClick={removeMenu} href="/">
          <GoSignOut className="icon" />
          <span>Log out</span>
        </a>

      </ul>
    </React.Fragment>
  );
}

export default Navbar;
