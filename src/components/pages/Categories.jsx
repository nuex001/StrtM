import /**React ,*/ { useState, useRef, useEffect } from 'react'
import "../../css/profile.css"
import avatar from "../../images/avatar.jpg";
import { MdSubscriptions } from "react-icons/md";
import { NavLink, useParams, useLocation } from "react-router-dom";
import AudioItem from '../layouts/AudioItem';
import { GiUpgrade } from "react-icons/gi";
import { AiFillCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchMusics, fetchSubscriptionNo, upgradeStorage, clear } from '../../redux/audio';
import Spinner from '../layouts/Spinner';
import { numRound } from "../../utils/uils"


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Categories() {
    const [cats] = useState([
        "Jazz",
        "Top",
        "Hiphop",
        "Amphiano",
        "Gospel",
        "Dj"
    ])
    const overlay = useRef();
    let { cat } = useParams();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const { musics, error, success, owner, subscriptionNo } = useSelector((state) => state.audios);

    const toggleupgrade = () => {
        overlay.current.classList.toggle("active")
    }
    const errorMsgs = (e) =>
        toast(e, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            type: "error",
            theme: "dark",
        });
    const successMsg = (e) =>
        toast(e, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            type: "success",
            theme: "dark",
        });
    // owner
    useEffect(() => {
        if (owner) {
            dispatch(fetchSubscriptionNo(owner));
        }
    }, [owner])
    useEffect(() => {
        if (error !== null) {
            if (error.toLowerCase().includes("doesn't exists")) {
                errorMsgs("Incorrect Email or Subscriber doesn't exist");
            } else {
                errorMsgs(error);
            }
            dispatch(clear());
        } else if (success) {
            successMsg(success);
            dispatch(clear());
            setTimeout(() => { //refresh
                overlay.current.classList.remove("active")
            }, 6000);
        }
    }, [error, success]);
    //
    useEffect(() => {
        const mainCat = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
        dispatch(fetchMusics(mainCat.toLowerCase()));
    }, [pathname])

    const submitUpgrade = (e) => {
        e.preventDefault();
        if (e.target.amount.value.trim() !== "") {
            dispatch(upgradeStorage(e.target));
        } else {
            errorMsgs("Please Fill all Inputs")
        }
    }

    return (
        <section className="profile">
            <div className="subNav">
                <p><span>
                    {
                        subscriptionNo > 0 &&
                        numRound(subscriptionNo)
                    }
                </span><MdSubscriptions /></p>
                <button onClick={toggleupgrade}>
                    Upgrade
                    <GiUpgrade className='icon' />
                </button>
                <img src={avatar} alt="" />
            </div>
            <main>
                <div className="subMain">
                    <h1>{cat}</h1>
                    <div className="box">
                        <NavLink to="/categories/New Release">
                            Recent
                        </NavLink>
                        {cats.map((cat, key) => (
                            <NavLink to={`/categories/${cat}`} key={key}>{cat}</NavLink>
                        ))}
                    </div>
                    <div className="row">
                        {!musics ?
                            <Spinner />
                            :
                            musics.length > 0 &&
                            musics.map(music => (
                                <AudioItem key={music._id} item={music} />
                            ))
                        }
                    </div>
                </div>
            </main>
            <div className="overlay upgrade" ref={overlay} >
                <ToastContainer />
                <form action="" className='upgrade'
                    onSubmit={submitUpgrade}
                >
                    <AiFillCloseCircle className='icon' onClick={toggleupgrade} />
                    <h1>UPGRADE STORAGE ALLOCATION</h1>
                    <div className="row">
                        <label htmlFor="amount">1Sepolia === 20mb</label>
                        <input type="number" placeholder="0" id='amount' name='amount' />
                    </div>
                    <button>
                        Upgrade
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Categories