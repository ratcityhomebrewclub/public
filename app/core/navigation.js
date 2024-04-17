'use client'
import Link from 'next/link';
import { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';

export const links = [
  {'name': 'Home', 'href': '/', 'enabled': true },
  {'name': 'About', 'href': '/about', 'enabled': true },
  {'name': 'Calendar', 'href': '/calendar', 'enabled': true },
  {'name': 'Calculators', 'href': '/calculators', 'enabled': false },
  {'name': 'Contact', 'href': '/contact', 'enabled': true },
  {'name': 'Membership', 'href': '/membership', 'enabled': true },
  {'name': 'Useful Links', 'href': '/links', 'enabled': true },
]

const navFlipWidth = 768;
const getLinks = () => {
  return links.map((link) => {
    if(link.enabled){
      return (
        <Link key={link.name} href={link.href}>{link.name}</Link>
      );
    }
  });
}

export function Title(){
  return (
    <div id="title" className="flex flex-col basis-full lg:basis-1/3">
      <h1 className="mb-6">Rat City Homebrew Club</h1>
      <p className="">Homebrewers Club in Seattle</p>
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
  const toggle = () => {
    setSideOpen(!sideOpen);
  }

  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    console.log("Setting width " + newWidth)
    setWidth(newWidth);
    changeNavButton();
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);

  // // change between the logo and the button when the user scrolls
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 || window.innerWidth < navFlipWidth) {
      setShowButton(true);
    } else {
      setShowButton(false);
      setSideOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

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
