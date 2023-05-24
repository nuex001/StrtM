// import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import Navbar from "./components/layouts/Navbar";
import Playlist from "./components/pages/Playlist";
import Collections from "./components/pages/Collections";
import Upload from "./components/pages/Upload"
import Search from "./components/pages/Search";
import Playing from "./components/layouts/Playing";
import Profile from "./components/pages/Profile";
import Subscriptions from "./components/pages/Subscriptions";
import Categories from "./components/pages/Categories";
import CommingSoon from "./components/pages/CommingSoon";
import Subscription from "./components/pages/Subscription";
import PrivateRoute from "./PrivateRoute";
import ScrollToTop from "./components/layouts/ScrollToTop"

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <ScrollToTop/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
          <Route exact path="/playlist/:id" element={<Playlist />} />
          <Route exact path="/collections/*" element={<Collections />} />
          <Route exact path="/profile/*" element={<Profile />} />
          <Route exact path="/subscription" element={<Subscriptions />} />
          <Route exact path="/subscription/:id" element={<Subscription />} />
          </Route>
          <Route exact path="/categories/:cat" element={<Categories />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="*" element={<CommingSoon />} />
          {/* <Route exact path="/upload" element={<Upload />} /> */}
        </Routes>
        <Playing />
      </div>
    </Router>
  );
}

export default App;

// switch to create react