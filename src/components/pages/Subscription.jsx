import React, { useState, useEffect, useRef } from 'react'
import "../../css/profile.css"
import avatar from "../../images/avatar.jpg";
import { fetchSubscriptionMusics, unSubscribeToUser, clear, upgradeStorage, fetchSubscriptionNo } from '../../redux/audio';
import { useDispatch, useSelector } from "react-redux";
import { MdSubscriptions } from "react-icons/md";
import { numRound } from "../../utils/uils"
import { AiFillCloseCircle } from "react-icons/ai";
import { GiUpgrade } from "react-icons/gi";
import AudioItem from '../layouts/AudioItem';
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from '../layouts/Spinner';
function Subscription() {
    const overlay = useRef();
    const overlay2 = useRef();
    let { id } = useParams();
    const dispatch = useDispatch();
    const [address, setAddress] = useState(null)
    const { subscriber, error, success, musics, owner, subscriptionNo } = useSelector((state) => state.audios);

    const toggleEmailSub = (e) => {
        e.preventDefault();
        setAddress(e.target.getAttribute("data-address"))
        overlay.current.classList.toggle("active")
    }
    const toggleupgrade = () => {
        overlay2.current.classList.toggle("active")
        overlay.current.classList.romove("active")
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

    useEffect(() => {
        dispatch(fetchSubscriptionMusics(id));
    }, [])
    // owner
    useEffect(() => {
        if (owner) {
            dispatch(fetchSubscriptionNo(owner));
        }
    }, [owner])
    useEffect(() => {
        if (error !== null) {
            // console.log(error);
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
                overlay2.current.classList.remove("active")
                dispatch(fetchSubscriptionMusics(id));
            }, 6000);
        }
    }, [error, success]);

    const submitUpgrade = (e) => {
        e.preventDefault();
        if (e.target.amount.value.trim() !== "") {
            dispatch(upgradeStorage(e.target));
        } else {
            errorMsgs("Please Fill all Inputs")
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (e.target.email.value !== "") {
            dispatch(unSubscribeToUser({ email: e.target.email.value, ownerId: address }));
        } else {
            errorMsgs("Please input email")
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
                    {/* <h1>Profile</h1> */}
                    <div className='header'>
                        <img src={avatar} alt="" />
                        {subscriber &&
                            <div className="text">
                                <h2>{subscriber.ownerId}</h2>
                                <p className='suscribe' style={{ fontSize: "12px" }}>
                                    {numRound(subscriber.mails.length)}
                                    <MdSubscriptions className="user" style={{ color: "var(--color)" }} />
                                </p>
                                <h3 style={{ cursor: "pointer" }} data-address={subscriber.ownerId} onClick={toggleEmailSub}>Unsubcribe</h3>
                            </div>
                        }
                    </div>
                    <div className="row">
                        {musics ?
                            musics.length > 0 &&
                            musics.map(music => (
                                <AudioItem key={music._id} item={music} />
                            ))
                            :
                            <Spinner />
                        }
                    </div>
                </div>
            </main>
            <div className="overlay" ref={overlay}>
                <ToastContainer />
                <form action="" onSubmit={onSubmit}>
                    <AiFillCloseCircle className='icon' onClick={toggleEmailSub} />
                    <h1>UNSUBSCRIBE TO USER</h1>
                    <div className="row" style={{ width: "100%" }}>
                        <input type="email" name="email" required id="email" placeholder="Email" />
                    </div>
                    <button>UnSubscribe</button>
                </form>
            </div>
            <div className="overlay upgrade" ref={overlay2} >
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

export default Subscription