"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { loadStripe } from "@stripe/stripe-js";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import { openLoginModal } from "@/redux/modalSlice";
import { useDispatch } from "react-redux";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SignupModal";
import { onAuthStateChanged } from "firebase/auth";
import { clearUser } from "@/redux/authSlice";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Settings = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        console.log("user signed in ", serializableUser);
        dispatch(setUser(serializableUser));
      } else {
        console.log("no user signed in");
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Search />
      <Sidebar />
      <LoginModal />
      <SignupModal />
      <div class="container">
        <div class="row">
          {!user ? (
            <>
              <div class="section__title page__title">Settings</div>

              <div className="settings__login--wrapper">
                <img
                  style={{ height: "480px", width: "650px" }}
                  src="login.png"
                  alt="log in"
                />
                <h2 className="settings__login--text">
                  Log in to your account to see your details
                </h2>
                <button
                  className="btn settings__login--btn"
                  onClick={() => openLoginModal()}
                >
                  Login
                </button>
              </div>
            </>
          ) : (
            <>
              <div class="section__title page__title">Settings</div>
              <div class="setting__content">
                <div class="settings__sub--title">Your Subscription plan</div>
                <div class="settings__text">premium-plus</div>
              </div>
              <div class="setting__content">
                <div class="settings__sub--title">Email</div>
                <div class="settings__text">hanna@gmail.com</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
