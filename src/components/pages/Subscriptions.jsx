import /**React ,*/ { useEffect, useRef, useState } from 'react'
import "../../css/subscription.css"
import avatar from "../../images/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscription, unSubscribeToUser, clear } from '../../redux/audio';
import { MdSubscriptions } from "react-icons/md";
import { Link } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa"
import { AiFillCloseCircle } from "react-icons/ai";
import { numRound } from "../../utils/uils"
import { GiUpgrade } from "react-icons/gi";

import { upgradeStorage, fetchSubscriptionNo } from '../../redux/audio';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Subscriptions() {
    const overlay = useRef();
    const overlay2 = useRef();
    const dispatch = useDispatch();
    const [address, setAddress] = useState(null)
    const { subscriptions, error, success, owner, subscriptionNo } = useSelector((state) => state.audios);

    const toggleupgrade = () => {
        overlay2.current.classList.toggle("active")
        overlay.current.classList.romove("active")
    }
    const toggleEmailSub = (e) => {
        e.preventDefault();
        setAddress(e.target.getAttribute("data-address"))
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

    useEffect(() => {
        dispatch(fetchSubscription());
    }, [])
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
        <section className="subscription">
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
                    <h1>Subscription</h1>
                    <div className="row">
                        {
                            subscriptions &&
                            subscriptions.map(subscription => (
                                <Link to={`/subscription/${subscription._id}`} key={subscription._id}>
                                    <img src={avatar} alt="" />
                                    <div className="text">
                                        <h2>{subscription.ownerId}</h2>
                                        <p className='suscribe' style={{ fontSize: "12px" }}>
                                            {numRound(subscription.mails.length)}
                                            <MdSubscriptions className="user" style={{ color: "var(--color)" }} />
                                        </p>
                                        <h3 onClick={toggleEmailSub} data-address={subscription.ownerId}>Unsubcribe</h3>
                                    </div>
                                </Link>
                            ))
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

export default Subscriptions