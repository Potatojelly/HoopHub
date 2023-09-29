import './App.css';
import Header from './components/Header/Header';
import {Outlet} from "react-router-dom";
function App({friendService}) {
  return (
    <>
      <Header friendService={friendService}/>
      <Outlet/>
    </>
  );
}

export default App;
