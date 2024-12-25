/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/constant";
import { ChevronDown, LogOutIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { hamburger } from "../../../public/auth";
import MyImage from "./MyImage";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { getCookie } from "@/utils/getCookieForClient";

const Nav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [submenuStates, setSubmenuStates] = useState<{
    [key: number]: boolean;
  }>({});
  const path = usePathname();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const response = await fetch(`/api/auth/logout`, {
        method: "POST",
      });

      if (response.ok) {
        setIsLogout(false); // Close the logout dialog

        window.location.reload(); // Force a full reload if already on "/"
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to logout");
      }
    } catch (error) {
      toast.error("An error occurred while logging out");
    } finally {
      setLogoutLoading(false);
      window.location.reload()
    }
  };
  const customerId = getCookie("id");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSubmenu = (submenuKey: number) => {
    setSubmenuStates((prevState) => ({
      ...prevState,
      [submenuKey]: !prevState[submenuKey],
    }));
  };

  return (
    <nav
      className={cn(
        "w-full max-w-full h-32 wrapper mx-auto flex justify-between items-center fixed top-0 z-20 transition-colors duration-500 transition-timing-function-ease-in-out"
      )}
    >
      <div className="w-full flex justify-between items-center mx-auto px-10">
        <div className="">
          <Link href={"/"}>
            <p className="font-bold text-28">BAY SAY BLOGGING</p>
          </Link>
        </div>
        <div className="w-full mx-auto px-6 text-[16px] font-medium hidden 3xl:inline ">
          <div className="w-fit mx-auto bg-white rounded-full py-4 px-8 ">
            <ul className="w-fit flex justify-center flex-row items-center gap-8">
              {navigation.map((nav, i) => (
                <div key={i}>
                  {nav.submenu && nav.submenu.length > 0 ? (
                    <li className="relative group flex gap-2 nav-link before:bg-default">
                      {nav.title}
                      {nav.submenu && (
                        <span>
                          <ChevronDown width={20} />
                        </span>
                      )}
                      {nav.submenu && (
                        <div className="absolute top-10 border-0 min-w-[15rem] group-hover:border text-black bg-white w-full my-2 rounded max-h-0 overflow-hidden group-hover:max-h-[45rem] duration-300 px-5">
                          <ul className="py-1">
                            {nav.submenu.map(
                              (submenu, index) =>
                                nav.title != submenu.text && (
                                  <li
                                    key={index}
                                    className="hover:text-default py-2"
                                  >
                                    <Link href={submenu.link}>
                                      {submenu.text}
                                    </Link>
                                  </li>
                                )
                            )}
                          </ul>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li className="relative group nav-link before:bg-default">
                      <Link href={nav.link} className="flex gap-2">
                        {nav.title}
                        {nav.submenu && (
                          <span>
                            <ChevronDown width={20} />
                          </span>
                        )}
                      </Link>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
        {customerId != null ? (
          <Button
            onClick={() => setIsLogout(true)}
            className="flex gap-3 text-16 text-white hover:!bg-default  py-3"
          >
            <LogOutIcon className="h-5 w-5" />
            <p>Logout</p>
          </Button>
        ) : (
          <div
            className={cn(
              "w-[230px] hidden group jellyEffect overflow-hidden 3xl:flex justify-center items-center gap-4 text-[16px] font-semibold text-whitefade border-2 bordder-white px-6 py-3 bg-default ease-in rounded-full relative"
            )}
          >
            <div className="absolute -left-96 w-96 h-12 rounded-full opacity-35 bg-blue-300 group-hover:translate-x-60  transition-transform group-hover:duration-1000 duration-500"></div>
            <div className="absolute -left-96 w-96 h-12 rounded-full opacity-25 bg-blue-400 group-hover:translate-x-60  transition-transform group-hover:duration-700 duration-700"></div>
            <div className="absolute -left-96 w-96 h-12 rounded-full opacity-15 bg-blue-500 group-hover:translate-x-60  transition-transform group-hover:duration-500 duration-1000"></div>
            <Link href={"/signin"}>
              <div className="relative z-10 flex items-center justify-center gap-4">
                {`Login / SignUp`}
              </div>
            </Link>
          </div>
        )}
      </div>
      <Sheet key={path}>
        <SheetTrigger className="bg-black rounded-lg relative w-10 h-10 px-1 py-1 group 3xl:hidden">
          <MyImage
            className="p-2 text-white stroke-black-100 fill-black-100"
            src={hamburger}
            layout="fill"
            alt={"hamburger icon"}
          />
        </SheetTrigger>
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription>
              <ul className="min-h-screen items-start mt-8 flex flex-col text-white-500 gap-8 overflow-y-scroll overflow-x-hidden">
                {navigation.map((nav, i) => (
                  <div key={i}>
                    {nav.submenu ? (
                      <li className="group">
                        <span
                          className="flex gap-2"
                          onClick={() => toggleSubmenu(i)}
                        >
                          {nav.title}
                          {nav.submenu && (
                            <span>
                              <ChevronDown width={20} />
                            </span>
                          )}
                        </span>
                        {nav.submenu && (
                          <div
                            className={`relative border-0 min-w-[20rem] group-hover:border !text-black bg-white w-full my-2 rounded ${
                              submenuStates[i] ? "block" : "hidden"
                            } duration-300 px-5`}
                          >
                            <ul className="py-1">
                              {nav.submenu.map((submenu, index) => (
                                <li key={index} className="text-left py-2">
                                  <Link href={submenu.link}>
                                    {submenu.text}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ) : (
                      <li className="relative group">
                        <Link href={nav.link} className="flex gap-2">
                          {nav.title}
                          {nav.submenu && (
                            <span>
                              <ChevronDown width={20} />
                            </span>
                          )}
                        </Link>
                      </li>
                    )}
                  </div>
                ))}
                <div className="w-full flex items-center justify-center">
                  {customerId != null ? (
                    <Button
                      onClick={() => setIsLogout(true)}
                      className="flex gap-3 text-16 text-white hover:!bg-default py-3"
                    >
                      <LogOutIcon className="h-5 w-5" />
                      <p>Logout</p>
                    </Button>
                  ) : (
                    <div
                      className={cn(
                        "w-[220px] group jellyEffect overflow-hidden flex justify-center items-center gap-4 text-[16px] font-semibold text-white px-6 py-3 bg-default ease-in rounded-full relative"
                      )}
                    >
                      <div className="absolute -left-96 top-0 w-96 h-12 rounded-full opacity-35 bg-blue-300 group-hover:translate-x-60  transition-transform group-hover:duration-1000 duration-500"></div>
                      <div className="absolute -left-96 top-0 w-96 h-12 rounded-full opacity-25 bg-blue-400 group-hover:translate-x-60  transition-transform group-hover:duration-700 duration-700"></div>
                      <div className="absolute -left-96 top-0 w-96 h-12 rounded-full opacity-15 bg-blue-500 group-hover:translate-x-60  transition-transform group-hover:duration-500 duration-1000"></div>
                      <Link href={"/signin"}>
                        <div className="relative z-10 flex items-center justify-center gap-4">
                          {`Login / SignUp`}
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </ul>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {/* Dialog for logout */}
      <Dialog open={isLogout} onOpenChange={setIsLogout}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogout(false)}
              disabled={logoutLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Nav;
