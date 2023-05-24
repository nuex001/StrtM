import React, { useState, useRef, useEffect } from 'react'
import "../../css/profile.css"
import avatar from "../../images/avatar.jpg";
import { MdSubscriptions } from "react-icons/md";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMusics, fetchFewSubscription } from '../../redux/audio';
import { numRound } from "../../utils/uils"
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import { RiGalleryUploadFill } from "react-icons/ri";
import { GiUpgrade } from "react-icons/gi";
import AudioItem from '../layouts/AudioItem';
import axios from 'axios';
import Select from "react-select";
import Spinner from '../layouts/Spinner';
import { upgradeStorage, clear, createMusic, fetchSubscriptionNo } from '../../redux/audio';
import Web3 from "web3"
import { ethers } from "ethers"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Profile() {
    const [cats] = useState([
        "Jazz",
        "Top",
        "Hiphop",
        "Amphiano",
        "Gospel",
        "Dj"
    ])
    const sideBar = useRef();
    const overlay = useRef();
    const overlay2 = useRef();
    const [mainStorage, setMainStorage] = useState(0);
    const [mainAllocatedStorage, setMainAllocatedStorage] = useState(0);
    const [titleExists, setTitleExists] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedcoverDp, setSelectedcoverDp] = useState(null);
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const { musics, subscriptions, error, success, owner, subscriptionNo, contract, provider } = useSelector((state) => state.audios);
    const cat = [
        { value: "Jazz", label: "Jazz" },
        { value: "Hiphop", label: "Hiphop" },
        { value: "Amphiano", label: "Amphiano" },
        { value: "Gospel", label: "Gospel" },
        { value: "Dj", label: "Dj" }
    ];
    const toggleSub = () => {
        sideBar.current.classList.toggle("active")
    }
    const toggleupgrade = () => {
        overlay2.current.classList.remove("active")
        overlay.current.classList.toggle("active")
    }
    const toggleupload = () => {
        overlay.current.classList.remove("active")
        overlay2.current.classList.toggle("active")
    }
    const fetchStorage = async () => {
        const res = await axios.get("https://strtmbackend.richeshomesconsult.com/api/user");
        if (res.data.user) {
            const { storage, allocatedStorage } = res.data.user;
            setMainStorage((storage / allocatedStorage) * 1 * 100);
            setMainAllocatedStorage(allocatedStorage)
        }
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
        dispatch(fetchFewSubscription());
        fetchStorage();
    }, [])
    // owner
    useEffect(() => {
        if (owner) {
            dispatch(fetchSubscriptionNo(owner));
        }
    }, [owner])

    useEffect(() => {
        const mainCat = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
        if (mainCat === "") {
            dispatch(fetchMusics("new release"));
        } else {
            dispatch(fetchMusics(mainCat.toLowerCase()));
        }
    }, [pathname])

    useEffect(() => {
        if (error !== null) {
            errorMsgs(error);
            dispatch(clear());
        } else if (success) {
            successMsg(success);
            dispatch(clear());
            setTimeout(() => { //refresh
                overlay.current.classList.remove("active")
                overlay2.current.classList.remove("active")
            }, 6000);
        }
    }, [error, success]);

    const style = {
        control: (base, state) => ({
            ...base,
            border: state.isFocused ? "none" : "none",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            background: "var(--backgrond)",
            '&:hover': {
                border: state.isFocused ? "none;" : "none;",
            }
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: "var(--backgrond)",
        }),
        option: (styles) => ({
            ...styles,
            background: "var(--backgrond)",
            color: "var(--text)",
        })
    }
    const submitUpgrade = async (e) => {
        e.preventDefault();
        const amount = e.target.amount.value.trim()
        if (amount !== "") {
            await contract.methods["increaseSpace"]().send({
                from: owner,
                value: Web3.utils.toWei(amount, "ether")
            });
            const latestBlockNumber = await provider.eth.getBlockNumber();
            contract.events.allocatedSpaceFundz({
                filter: { from: owner },
                fromBlock: latestBlockNumber,
                toBlock: latestBlockNumber
            })
                .on('data', function (event) {
                    if (event.returnValues.from === owner) {
                        dispatch(upgradeStorage(e.target));
                    }
                })
                .on('error', () => {
                    // console.log("Error Occurred", error);
                })
        } else {
            errorMsgs("Please Fill all Inputs")
        }
    }
    const fetchTitle = async (e) => {
        const result = await axios.get(`https://strtmbackend.richeshomesconsult.com/api/music/title/${e.target.value}`);
        setTitleExists(result.data.msg);
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileSize = Math.ceil(file.size / (1024 * 1024));
        setSelectedFile(fileSize);
    };
    const handleCoverdpChange = (event) => {
        const file = event.target.files[0];
        const fileSize = Math.ceil(file.size / (1024 * 1024));
        setSelectedcoverDp(fileSize);
    };
    // UPLOAD MUSIC
    const UploadMusic = async (e) => {
        e.preventDefault();
        const { title, balance, totalStreams, musicCat, link, lyrics, artist, file, coverdp } = e.target;
        if (title.value.trim() !== "" && file.value.trim() !== "" && coverdp.value.trim() !== "" && balance.value.trim() !== "" && totalStreams.value.trim() !== "" && musicCat.value.trim() !== "" && link.value.trim() !== "" && lyrics.value.trim() !== "" && artist.value.trim() !== "") {
            const bigNumberValue = ethers.BigNumber.from(selectedFile + selectedcoverDp);
            await contract.methods.createMusic(title.value, totalStreams.value, bigNumberValue.toString()).send({
                from: owner,
                value: Web3.utils.toWei(balance.value, "ether")
            });
            const latestBlockNumber = await provider.eth.getBlockNumber();
            contract.events.musicCreated({
                filter: { sender: owner },
                fromBlock: latestBlockNumber,
                toBlock: latestBlockNumber
            })
                .on('data', function (event) {
                    if (event.returnValues.sender === owner) {
                        dispatch(createMusic(e.target));
                    }
                })
                .on('error', (error) => {
                    console.log(error, "Erorr");
                })
        } else if (titleExists) {
            errorMsgs("Title already exists");
        }
        else {
            errorMsgs("Please Fill all Inputs");
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
                <button onClick={toggleupload}>
                    Upload
                    <RiGalleryUploadFill className='icon' />
                </button>
                <img src={avatar} alt="" onClick={toggleSub} />
            </div>
            <main>
                <div className="subMain">
                    <div className="box">
                        <NavLink to="/profile/">
                            Recent
                        </NavLink>
                        {cats.map((cat, key) => (
                            <NavLink to={`${cat}`} key={key}>{cat}</NavLink>
                        ))}
                        {/* <CiMenuFries className='toggle'/> */}
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
                <div className='sidebar' ref={sideBar}>
                    <Link to="/subscription/" className='head'>Subscriptions</Link>
                    <div className="rows">
                        {
                            subscriptions &&
                            subscriptions.map(subscription => (
                                <Link to={`/subscription/${subscription._id}`} key={subscription._id}>
                                    <img src={avatar} alt="" />
                                    <div className="text">
                                        <p className='suscribe' style={{ fontSize: "12px" }}>
                                            {numRound(subscription.mails.length)}
                                            <MdSubscriptions className="user" style={{ color: "var(--color)" }} />
                                        </p>
                                        <h3>Unsubcribe</h3>
                                    </div>
                                </Link>
                            ))
                        }
                        <div className="storage">
                            <h1>Storage space</h1>
                            <h2><span>Allocated space:</span> {mainAllocatedStorage && mainAllocatedStorage}mb</h2>
                            <div className="progress_cont">
                                <div className="progress_bar" style={{ width: `${mainStorage}%` }}></div>
                            </div>
                            <button onClick={toggleupgrade}>Upgrade
                                <GiUpgrade className='icon' />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <div className="overlay" ref={overlay} >
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
            <div className="overlay" ref={overlay2}>
                <ToastContainer />
                <form action="" className='upload'
                    encType="multipart/form-data"
                    onSubmit={UploadMusic}
                >
                    <AiFillCloseCircle className='icon' onClick={toggleupload} />
                    <h1>UPLOAD MUSIC</h1>
                    <div className="row">
                        <label htmlFor="title">Tittle</label>
                        <input type="text" name='title' placeholder="Title" id='title'
                            onKeyDown={fetchTitle}
                            onKeyUp={fetchTitle}
                        />
                        {titleExists !== null
                            &&
                            <>
                                {titleExists ?
                                    <span style={{ color: "crimson", fontWeight: 600, fontSize: "10px" }}>Tittle EXISTS <AiFillCloseCircle /></span>
                                    :
                                    <span style={{ color: "green", fontWeight: 600, fontSize: "10px" }}>Tittle Doesnt EXISTS <AiFillCheckCircle /></span>}
                            </>
                        }
                    </div>
                    <div className="row">
                        <label htmlFor="artist">Artist</label>
                        <input type="text" name='artist' placeholder="Artist" id='artist' />
                    </div>
                    <div className="row">
                        <label htmlFor="audio">Music</label>
                        <input onChange={handleFileChange} style={{ boxShadow: "none", cursor: "pointer" }} type="file" name='file' placeholder="audio" id='audio' accept='audio/*' />
                    </div>
                    <div className="row">
                        <label htmlFor="coverdp">Cover Dp</label>
                        <input onChange={handleCoverdpChange} style={{ boxShadow: "none", cursor: "pointer" }} type="file" name='coverdp' placeholder="coverdp" id='coverdp' accept='image/*' />
                    </div>
                    <div className="row">
                        <label htmlFor="balance"> Stake Token</label>
                        <input type="number" name='balance' placeholder="0" id='token' />
                    </div>
                    <div className="row">
                        <label htmlFor="totalStreams">Total Streams</label>
                        <input type="number" placeholder="0" id='totalStreams' name='totalStreams' />
                    </div>
                    <div className="row cat">
                        <label htmlFor="musicCat">Music Category</label>
                        <Select options={cat} name="musicCat"
                            styles={style}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    text: "#fff",
                                    primary25: "#fff",
                                    primary: "#fff"
                                }
                            })}
                        />
                    </div>
                    <div className="row">
                        <label htmlFor="url">Music Link</label>
                        <input type="url" placeholder="https://www.audiomark.com" id='url' name='link' />
                    </div>
                    <div className="row">
                        <label htmlFor="lyrics">Lyrics</label>
                        <textarea name="lyrics" id="lyrics" />
                    </div>
                    <button>
                        Upload
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Profile