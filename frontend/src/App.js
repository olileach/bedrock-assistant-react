import Main from './Main/Main'
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactModal from 'react-modal';
import {store} from './Main/Store/index.js';
import { Provider } from 'react-redux';


// window.LOG_LEVEL = 'DEBUG';

//React Modal
ReactModal.setAppElement('#root');

export default function App() {

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div className="App">
      <Provider store={store}>
        <Main>
        </Main>
      </Provider>

    </div>
  );
};