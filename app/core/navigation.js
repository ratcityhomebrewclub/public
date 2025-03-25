'use client'
import Link from 'next/link';
import { useState, useEffect } from "react";
import { logPageView } from './analytics';
import MenuIcon from '@mui/icons-material/Menu';

export const links = [
  {'name': 'Home', 'href': '/', 'level': 0, 'enabled': true },
  {'name': 'About', 'href': '/about', 'level': 0, 'enabled': true },
    {'name': 'Bylaws', 'href': '/about/bylaws', 'level': 1, 'enabled': false },
    {'name': 'Club History', 'href': '/about/history', 'level': 1, 'enabled': false },
    {'name': 'Officers', 'href': '/about/officers', 'level': 1, 'enabled': true },
  {'name': 'Calendar', 'href': '/calendar', 'level': 0, 'enabled': true },
  {'name': 'Calculators', 'href': '/calculators', 'level': 0, 'enabled': false },
  {'name': 'Contact', 'href': '/contact', 'level': 0, 'enabled': true },
  {'name': 'Membership', 'href': '/membership', 'level': 0, 'enabled': true },
  {'name': 'Awards', 'href': '/awards', 'level': 0, 'enabled': true },
  {'name': 'The Rat Cup', 'href': '/ratcup', 'level': 0, 'enabled': true },
  {'name': 'Useful Links', 'href': '/links', 'level': 0, 'enabled': true },
]



const navFlipWidth = 768;
const getLinks = () => {
  return links.map((link) => {
    if(link.enabled){
      return (
        <Link className={"link-" + link.level} key={link.name} href={link.href} onClick={logPageView}>{link.name}</Link>
      );
    }
  });
}

export function Title(){
  return (
    <div id="title" className="flex flex-col basis-full lg:basis-1/3">
      <h1 className="">Rat City Homebrew Club</h1>
      <p className="">Homebrewers club in Seattle</p>
    </div>
  );
}

export function Sidebar(props){
  return (
    <div id="sidebar"
      className="sidebar-container flex flex-col fixed overflow-hidden justify-center mt-[120px] p-5 top-10 right-5 z-10 bg-gray-700/80"
      style={{ 
        visibility: `${props.sideOpen ? "visible" : "hidden"}`, 
      }}>
        {getLinks()}
    </div>
  );
}

export function Navbar(props){
  return(
    <div id="navbar"
      className="flex flex-row basis-full lg:basis-2/3 text-sm items-center justify-between"
      style={{ 
        visibility: `${props.sideOpen ? "visible" : "hidden"}`, 
      }}>
      {getLinks()}
    </div>
  );
}

export default function Navigation() { 
  // Functionality for opening/closing nav
  const [sideOpen, setSideOpen] = useState(false);
  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);
  // // change between the logo and the button when the user scrolls
  const [showButton, setShowButton] = useState(false);
  
  const toggle = () => {
    setSideOpen(!sideOpen);
  }
  
  const updateWidth = () => {
    setWidth(window.innerWidth);
    changeNavButton();
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    window.addEventListener("scroll", changeNavButton);
    updateWidth();

    return () => {
      window.removeEventListener("resize", updateWidth);
      window.removeEventListener("scroll", changeNavButton);
    };
  }, []);


  const changeNavButton = () => {
    if (window.scrollY >= 400 || window.innerWidth < navFlipWidth) {
      setShowButton(true);
    } else {
      setShowButton(false);
      setSideOpen(false);
    }
  };


  return (
    <div id="navigation" className="flex flex-wrap lg:px-10 xl:px-40">
      <Title />
      <Sidebar sideOpen={sideOpen} toggle={toggle} />
    
      <div 
        onClick={() => {toggle()}}
        className="fixed top-10 right-5"
        style={{
          display: showButton ? "block" : "none"
        }}>
          <MenuIcon fontSize="large"/>
      </div>
      
      <Navbar sideOpen={!sideOpen && width > navFlipWidth} toggle={toggle} />
    </div>
  );
}
