import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <div className="p-3 px-5 flex justify-between shadow-md z-10">
      <Link to="/" className="flex justify-between">
        <img src="/logo.svg" alt="logo" width={100} height={100} />
      </Link>
      {isSignedIn && (
        <Link className="flex justify-center" to="/dashboard">
          <Button variant="outline" className="me-2">
            Dashboard
          </Button>
          <UserButton />
        </Link>
      )}
      {!isSignedIn && (
        <Link to="/auth/sign-in">
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
