import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as constants from "../utils/constants";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";

const Account = () => {
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const { user, subscribe, checkSubscriptionStatus, unsubscribe } =
    useAuthContext();

  useEffect(() => {
    checkSubscriptionStatus();
    if (!window.paypal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${constants.PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.onload = () => {
        setIsPaypalReady(true);
      };
      document.body.appendChild(script);
    } else {
      setIsPaypalReady(true);
    }

    return () => {
      if (window.paypal && isPaypalReady) {
        window.paypal.Buttons().close();
      }
    };
  }, []);

  useEffect(() => {
    if (isPaypalReady) {
      const paypalButtonContainer = document.querySelector(
        "#paypal-button-container"
      );
      if (paypalButtonContainer && !paypalButtonContainer.hasChildNodes()) {
        window.paypal
          .Buttons({
            style: {
              shape: "rect",
              color: "gold",
              layout: "vertical",
              label: "subscribe",
            },
            createSubscription: function (data, actions) {
              return actions.subscription.create({
                plan_id: constants.PLAN_ID,
              });
            },
            onApprove: async function (data, actions) {
              await subscribe(data.subscriptionID);
            },
            onError: function (err) {
              console.error("PayPal Button Error:", err);
            },
          })
          .render("#paypal-button-container");
      }
    }
  }, [isPaypalReady, subscribe]);

  const handleSubscribe = async () => {
    checkSubscriptionStatus();
  };

  const handleCancelSubscription = async () => {
    await unsubscribe();
    checkSubscriptionStatus();
  };

  return (
    <StyledBackground>
      <Navbar />
      <Overlay>
        <ContentWrapper>
          <Greeting>Hello, {user.email}!</Greeting>
          {user && user.subscriptionStatus === "active" ? (
            <>
              <SubscriptionInfo>
                You are subscribed (Subscription ID: {user.subscriptionId}).
              </SubscriptionInfo>
              <CancelButton onClick={handleCancelSubscription}>
                Cancel Subscription
              </CancelButton>
            </>
          ) : (
            <>
              <SubscriptionInfo>
                You are currently unsubscribed.
              </SubscriptionInfo>
              <div id="paypal-button-container" onClick={handleSubscribe}></div>
            </>
          )}
        </ContentWrapper>
      </Overlay>
    </StyledBackground>
  );
};

const StyledBackground = styled.div`
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #1d1d1d;
  height: 100vh;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: center;
  margin-top: 120px;
  width: 600px;
  background-color: rgba(65, 19, 130, 0.7);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const Greeting = styled.h2`
  color: #fcfcfc;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const SubscriptionInfo = styled.p`
  color: #fcfcfc;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const CancelButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #c9302c;
  }
`;

export default Account;
