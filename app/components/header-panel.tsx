"use client";

import { Bell, Headset, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UltimosGanhos } from "./ultimos-ganhos";
import { useState, useEffect } from "react";

interface HeaderPanelProps {
  name: string;
  handleLogout: () => void;
  setCurrentPage: (page: string) => void;
}

// Extend the Window interface to include Chatwoot properties
declare global {
  interface Window {
    $chatwoot?: {
      toggleBubbleVisibility: (action: "show" | "hide") => void;
      toggle: (state?: "open" | "close") => void;
      setUser: (identifier: string, userProps: any) => void;
      setCustomAttributes: (attributes: any) => void;
      reset: () => void;
    };
    chatwootSDK?: {
      run: (config: any) => void;
    };
    chatwootSettings?: {
      hideMessageBubble?: boolean;
      position?: "left" | "right";
      locale?: string;
      type?: "standard" | "expanded_bubble";
      darkMode?: "light" | "auto" | "dark";
    };
  }
}

export function HeaderPanel({
  name,
  handleLogout,
  setCurrentPage,
}: HeaderPanelProps) {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatwootLoaded, setChatwootLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Configure Chatwoot settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "pt",
      type: "standard",
      darkMode: "auto",
    };

    // Function to initialize Chatwoot
    const initializeChatwoot = () => {
      // Check if already loaded
      if (window.$chatwoot) {
        setChatwootLoaded(true);
        return;
      }

      // Create container for Chatwoot
      const container = document.createElement("div");
      container.id = "chatwoot-button-container";
      container.style.position = "fixed";
      container.style.bottom = "20px";
      container.style.right = "20px";
      container.style.zIndex = "1000";
      document.body.appendChild(container);

      // Load Chatwoot script
      const script = document.createElement("script");
      script.src = "https://suporte.mrpmobi.com.br/packs/js/sdk.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: "RH4JsqzjyL7xDoFTjSdYzeEg",
            baseUrl: "https://suporte.mrpmobi.com.br",
            targetId: "chatwoot-button-container",
            position: "custom",
          });

          // Listen for ready event
          window.addEventListener("chatwoot:ready", () => {
            setChatwootLoaded(true);
          });
        }
      };

      script.onerror = () => {
        //console.error("Failed to load Chatwoot script");
        setChatwootLoaded(false);
      };

      document.head.appendChild(script);
    };

    initializeChatwoot();

    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener("chatwoot:ready", () => {});

      // Don't remove script and container to avoid issues with Chatwoot
    };
  }, []);

  useEffect(() => {
    // Only try to toggle bubble if Chatwoot is loaded and available
    if (!chatwootLoaded || typeof window === "undefined" || !window.$chatwoot) {
      return;
    }

    try {
      if (isChatVisible) {
        window.$chatwoot.toggleBubbleVisibility("show");
      } else {
        window.$chatwoot.toggleBubbleVisibility("hide");
      }
    } catch (error) {
      //console.error("Error toggling Chatwoot bubble:", error);
      setChatwootLoaded(false);
    }
  }, [isChatVisible, chatwootLoaded]);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div
      className="flex flex-row justify-end items-center h-[70px] min-h-[70px] 
                 bg-primaryblack rounded-lg py-4 fixed top-4 md:top-6 z-50
                 left-4 right-4 w-[calc(100vw-32px)]
                 md:left-[328px] md:right-6 md:w-[calc(100vw-328px-24px)]"
    >
      <div className="inline-flex items-center gap-2.5 p-4 relative flex-[0_0_auto] mt-[-1.00px] mb-[-1.00px] rounded-lg">
        <SidebarTrigger className="h-10 w-10 rounded-xs p-0 hover:bg-transparent md:hidden" />
      </div>
      <div className="flex flex-row items-center gap-6 h-10 px-6 w-full justify-end">
        <div className="flex flex-row items-center gap-1">
          <Button
            size="icon"
            className="bg-primaryblack hover:bg-primarymobi text-greyscale-70 hover:text-primaryblack"
            onClick={toggleChat}
          >
            <Headset className="w-6 h-6" />
          </Button>
        </div>
        <UltimosGanhos />
        <NavUser
          name={name}
          handleLogout={handleLogout}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
