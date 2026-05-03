"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuthStore, type AuthView } from "../store/useAuthStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { RebootPasswordForm } from "./RebootPasswordForm";

type AnimationPhase = "idle" | "exiting" | "entering";

function AuthForm() {
  const { currentView, setCurrentView } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [displayView, setDisplayView] = useState<AuthView>(currentView);
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const pendingView = useRef<AuthView>(currentView);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    let targetView: AuthView = currentView;

    if (tokenFromUrl) {
      localStorage.setItem("reboot-token", tokenFromUrl);
      targetView = "reboot";
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const token = localStorage.getItem("reboot-token");
      if (token) {
        targetView = "reboot";
      }
    }

    if (targetView !== currentView) {
      setCurrentView(targetView);
      setDisplayView(targetView);
    }
    setIsReady(true);
  }, [setCurrentView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isReady || currentView === displayView) return;

    // Cancel any in-flight timers so rapid clicks don't stack
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    pendingView.current = currentView;
    setPhase("exiting");

    exitTimerRef.current = setTimeout(() => {
      // Swap content while it is still invisible (opacity 0)
      setDisplayView(pendingView.current);
      setPhase("entering");

      enterTimerRef.current = setTimeout(() => {
        setPhase("idle");
      }, 420);
    }, 220);

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    };
  }, [currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  let wrapperClass = "";

  if (phase === "exiting") {
    wrapperClass = "form-exit";
  } else if (phase === "entering") {
    wrapperClass = "form-enter";
  }

  if (!isReady) return null;

  return (
    <div className="conteiner-form">
      <Card className="w-full max-w-md mx-auto overflow-hidden ">
        <div className={wrapperClass}>
          {displayView === "login" && <LoginForm />}
          {displayView === "register" && <RegisterForm />}
          {displayView === "reset" && <ResetPasswordForm />}
          {displayView === "reboot" && <RebootPasswordForm />}
        </div>
      </Card>
    </div>
  );
}

export default AuthForm