import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string, hash?: string) => void;
  isHome: boolean;
  isResearch: boolean;
  isPrivileges: boolean;
  isContact: boolean;
  isAmcsEmpanelled: boolean;
  isCommissionDisclosure: boolean;
  activeSolutionId: string | null;
  isTransitioning: boolean;
  isDisclosureModalOpen: boolean;
  openDisclosureModal: () => void;
  closeDisclosureModal: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentPath: "/",
  navigate: () => {},
  isHome: true,
  isResearch: false,
  isPrivileges: false,
  isContact: false,
  isAmcsEmpanelled: false,
  isCommissionDisclosure: false,
  activeSolutionId: null,
  isTransitioning: false,
  isDisclosureModalOpen: false,
  openDisclosureModal: () => {},
  closeDisclosureModal: () => {},
});

export function NavigationProvider({ children }: { children: ReactNode }) {
  const getInitialPath = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (
        pathname.startsWith("/solutions/") ||
        pathname === "/research-and-insights" ||
        pathname === "/special-privileges" ||
        pathname === "/contact" ||
        pathname === "/amcs-empanelled" ||
        pathname === "/commission-disclosure"
      ) {
        return pathname;
      }
      return "/";
    }
    return "/";
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isDisclosureModalOpen, setIsDisclosureModalOpen] = useState<boolean>(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDisclosureModal = useCallback(() => {
    setIsDisclosureModalOpen(true);
  }, []);

  const closeDisclosureModal = useCallback(() => {
    setIsDisclosureModalOpen(false);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const pathname = window.location.pathname;
      const targetPath =
        pathname.startsWith("/solutions/") ||
        pathname === "/research-and-insights" ||
        pathname === "/special-privileges" ||
        pathname === "/contact" ||
        pathname === "/amcs-empanelled" ||
        pathname === "/commission-disclosure"
          ? pathname
          : "/";

      // Smooth popstate transition
      setIsTransitioning(true);
      setCurrentPath(targetPath);
      window.scrollTo({ top: 0, behavior: "instant" });

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const navigate = useCallback((path: string, hash?: string) => {
    if (typeof window === "undefined") return;

    const newPath =
      path.startsWith("/solutions/") ||
      path === "/research-and-insights" ||
      path === "/special-privileges" ||
      path === "/contact" ||
      path === "/amcs-empanelled" ||
      path === "/commission-disclosure"
        ? path
        : "/";

    // If clicking same path without hash, avoid redundant transitions
    if (newPath === currentPath && !hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let targetUrl = path;
    if (hash) {
      targetUrl += (targetUrl.includes("#") ? "" : `#${hash}`);
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    // Set transition state to true
    setIsTransitioning(true);

    // If navigating with a hash on the home page, perform smooth anchor scroll
    if (hash && newPath === "/") {
      window.history.pushState(null, "", targetUrl);
      setCurrentPath(newPath);
      setTimeout(() => {
        setIsTransitioning(false);
        const element = document.getElementById(hash);
        if (element) {
          const navOffset = 68;
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - navOffset;
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(element, { offset: -navOffset, duration: 1.0 });
          } else {
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }
      }, 80);
      return;
    }

    // Animate transition out then update route
    window.history.pushState(null, "", targetUrl);
    
    // Fast exit animation handover: update route after brief exit frame (~200ms)
    setTimeout(() => {
      setCurrentPath(newPath);
      window.scrollTo({ top: 0, behavior: "instant" });
      
      // End transition after enter animation completes (~350ms)
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 200);
  }, [currentPath]);

  const isResearch = currentPath === "/research-and-insights";
  const isPrivileges = currentPath === "/special-privileges";
  const isContact = currentPath === "/contact";
  const isAmcsEmpanelled = currentPath === "/amcs-empanelled";
  const isCommissionDisclosure = currentPath === "/commission-disclosure";
  const isHome =
    currentPath === "/" ||
    (!currentPath.startsWith("/solutions/") &&
      !isResearch &&
      !isPrivileges &&
      !isContact &&
      !isAmcsEmpanelled &&
      !isCommissionDisclosure);
  const activeSolutionId = currentPath.startsWith("/solutions/")
    ? currentPath.replace("/solutions/", "")
    : null;

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        navigate,
        isHome,
        isResearch,
        isPrivileges,
        isContact,
        isAmcsEmpanelled,
        isCommissionDisclosure,
        activeSolutionId,
        isTransitioning,
        isDisclosureModalOpen,
        openDisclosureModal,
        closeDisclosureModal,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
