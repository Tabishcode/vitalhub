import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider, SignedIn, SignIn, SignUp } from "@clerk/clerk-react"; // Clerk imports
import NavbarMain from "./components/NavbarMain.jsx";
import Home from "./pages/Home.jsx";
import FoodDashboard from "./pages/FoodDashboard.jsx";
import FitnessDashboard from "./pages/FitnessDashboard.jsx";
import Welcome from "./components/WelcomeFoodFitness.jsx";
import FoodForm from "./components/CaloriesRequirmentForm.jsx";
import Footer from "./components/Footer.jsx";
import FoodTimeTable from "./pages/FoodTimeTable.jsx";
import ExpensesDashboard from "./pages/ExpensesDashboard.jsx";
import "./index.css";
import "./style.css";

// Your Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      
      <Router>
        <NavbarMain />
       
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          
          <Route
            path="/fitness"
            element={
              <SignedIn>
                <FitnessDashboard />
              </SignedIn>
            }
          />
          <Route
            path="/FoodForm"
            element={
              <SignedIn>
                <FoodForm />
              </SignedIn>
            }
          />
          <Route
            path="/FoodDashBoard"
            element={
              <SignedIn>
                <FoodDashboard />
              </SignedIn>
            }
          />
          <Route
            path="/FoodTimeTable"
            element={
              <SignedIn>
                <FoodTimeTable />
              </SignedIn>
            }
          />
          <Route
            path="/ExpensesDashboard"
            element={
              <SignedIn>
                <ExpensesDashboard />
              </SignedIn>
            }
          />
        </Routes>
        <Footer />
      </Router>


    </ClerkProvider>
  </StrictMode>
);
