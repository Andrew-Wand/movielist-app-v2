import { BrowserRouter, Routes, Route } from "react-router-dom";

import MovieList from "./pages/MovieList";
import RatingList from "./pages/RatingList";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SpinPage from "./pages/SpinPage";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <MobileNavbar />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/rating-list" element={<RatingList />} />
          <Route path="/spin" element={<SpinPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
