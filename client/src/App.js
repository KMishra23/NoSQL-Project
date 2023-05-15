import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Home from "./components/home";
import RecordList from "./components/recordList";
import Analyse from "./components/analyse";
import Upload from "./components/upload";
import Edit from "./components/edit";
import Create from "./components/create";
 
const App = () => {
 return (
   <div className="container">
     <Navbar />
     <Routes>
       {/* <Route exact path="/" element={<RecordList />} /> */}
       <Route exact path="/" element={<Home/>}/>
       <Route path="/upload" element={<Upload />} />
       <Route path="/analyse" element={<Analyse />} />
     </Routes>
   </div>
 );
};
 
export default App;