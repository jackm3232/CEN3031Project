import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Routes from "./main"
const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
      <Routes />
    </div>
  );
};
export default App
