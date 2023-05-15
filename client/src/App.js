import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Home from "./components/home";
import Analyse from "./components/analyse";
import Upload from "./components/upload";
import ViewCollection from "./components/viewCollection";
 
const App = () => {
 return (
   <div className="container">
     <Navbar />
     <Routes>
       <Route exact path="/" element={<Home/>}/>
       <Route exact path="/:id" element={<ViewCollection/>}/>
       <Route path="/upload" element={<Upload />} />
       <Route path="/analyse" element={<Analyse />} />
     </Routes>
   </div>
 );
};
 
export default App;