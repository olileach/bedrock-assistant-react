import {React} from "react";
import { Route, Routes } from "react-router-dom";
import Footer from './Layout/Footer.js';
import Header from './Layout/Header.js';
import Architecture from "./Views/Architecture.js";
import Models from "./Views/Models.js";
import Question from "./Views/Question.js";
import Recorder from "./Views/Recorder.js";
// import ZoomApp from "./Views/Zoom.js"

export default function Main(){

    var modelName = localStorage.getItem("modelTextUsed");
    if (!modelName){
            modelName="anthropic.claude-v2";
            localStorage.setItem("modelTextUsed", modelName);
    }

    return (
        
        <div>
            <Header />
                <div>
                    <Routes>
                        <Route path="/" element={<Question />} />
                        <Route path="/architecture" element={<Architecture />} />
                        <Route path="/recorder" element={<Recorder />} />
                        <Route path="/models" element={<Models />} />
                        {/* <Route path="/zoom" element={<ZoomApp />} /> */}
                    </Routes>
                </div>
        </div>
    )
}
