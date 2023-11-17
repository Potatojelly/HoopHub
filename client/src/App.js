import Header from './components/Header/Header';
import {Outlet} from "react-router-dom";
function App({friendService}) {
  return (
    <div>
      <Header friendService={friendService}/>
      <Outlet/>
    </div>
  );
}

export default App;
