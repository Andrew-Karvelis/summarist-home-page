"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app, auth } from "@/firebase";
import { getPremiumStatus } from "./getPremiumStatus";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SignupModal";
import { openLoginModal } from "@/redux/modalSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AccountPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const email = auth.currentUser?.email;
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;
      setIsPremium(newPremiumStatus);
    };
    checkPremium();
  }, [app, auth.currentUser?.uid]);

  const upgradeToPremium = async () => {
    router.push("/choose-plan");
  };

  const openLoginModalHandler = () => {
    dispatch(openLoginModal());
  };

  const accountSummary = (
    <div>
      <div className="settings__sub--title">Email</div>
      <div className="settings__text">{email}</div>
    </div>
  );

  const statusPanel = isPremium ? (
    <div className="settings__text">Premium-Status</div>
  ) : (
    <div className="settings__text">
      Basic
      <button
        className="btn settings__btn"
        onClick={() => {
          upgradeToPremium();
        }}
      >
        Upgrade to Premium
      </button>
    </div>
  );

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
                  onClick={openLoginModalHandler}
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
                <div class="settings__text">{statusPanel}</div>
              </div>
              <div class="setting__content">{accountSummary}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
