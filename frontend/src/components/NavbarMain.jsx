import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react"; // Clerk components
import arrow_logo from "../../public/arrow_top.png";

const NavbarMain = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();



  // Close dropdown if clicked outside of it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <nav className="bg-gray-800 text-white p-4 top-0">
      <div className="container mx-auto flex justify-around items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src={arrow_logo}
            alt="logo"
            className="object-contain w-10 h-10"
          />
          <h3 className="font-semibold ml-2">VitalHub.</h3>
        </div>

        {/* Center Menu Items */}
        <div className="flex space-x-6 text-sm font-medium">
          <button
            className="hover:text-blue-300"
            onClick={() => navigate("/welcome")}
          >
            Food
          </button>
          <button
            className="hover:text-blue-300"
            onClick={() => navigate("/fitness")}
          >
            Fitness
          </button>
          <button
            className="hover:text-blue-300"
            onClick={() => navigate("/expensesDashboard")}
          >
            Money
          </button>
          <button
            className="hover:text-blue-300"
            onClick={() => navigate("/passwords")}
          >
            Passwords
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex justify-center items-center space-x-6">
          {/* Show buttons for signed-out users */}
          <SignedOut>
            <SignInButton>
              <div className="btn inline-flex bg-[#F85E76] cursor-pointer hover:bg-[#F85E76]/90 text-white space-x-2 rounded-full text-sm h-10 px-4 py-2 font-medium">
                Login
              </div>
            </SignInButton>
            <SignUpButton>
              <div className="btn inline-flex bg-primary cursor-pointer hover:bg-[#A768F0]/90 text-white space-x-2 rounded-full text-sm h-10 px-4 py-2 font-medium">
                Sign Up
              </div>
            </SignUpButton>
          </SignedOut>

          {/* Show UserButton for signed-in users */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "40px", // Adjust width
                    height: "40px", // Adjust height
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
