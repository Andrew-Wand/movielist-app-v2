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
import Header from "./components/Header";
import EmailSignUp from "./pages/EmailSignUp";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="bg-[#182635] shadow-lg ">
          <Header />
          <Navbar />
        </div>

        <Routes>
          <Route path="/rating-list" element={<PrivateRoute />}>
            <Route path="/rating-list" element={<RatingList />} />
          </Route>
          <Route path="/spin" element={<SpinPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up/email" element={<EmailSignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MovieList />} />
          </Route>
        </Routes>
        <MobileNavbar />
      </BrowserRouter>
    </>
  );
}

export default App;
