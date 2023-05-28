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

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Navbar />

        <Routes>
          <Route path="/rating-list" element={<PrivateRoute />}>
            <Route path="/rating-list" element={<RatingList />} />
          </Route>
          <Route path="/spin" element={<SpinPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
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
    </div>
  );
}

export default App;
