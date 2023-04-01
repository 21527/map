/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logo, menu, close } from "@/assets";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className='selection:bg-gray-600  selection:text-gray-200 bg-transparent z-20'>
      <div className='max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8'>
        <nav className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Link href={"/"}>
              <Image src={logo} alt='logo' className='w-9 h-9 object-contain' />
            </Link>
            <Link href='/' className='text-xl font-bold text-gray-800 px-3'>
              {/* M·A·P */}
              数字建筑
            </Link>
            <div className='hidden md:block'>
              <div className='flex items-baseline ml-10'>
                <div className='px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-slate-200 hover:text-slate-900 active:bg-black active:text-white focus:outline-none focus:bg-black focus:text-white relative group'>
                  智能生成
                  <ul className='absolute hidden group-hover:block group-active:block  bg-slate-200 py-3'>
                    <Link href={"/park"} className='hover:bg-slate-300'>
                      产业园区
                    </Link>
                    <Link href={"/city"} className='hover:bg-slate-300'>
                      城市生成
                    </Link>
                  </ul>
                </div>
                {[
                  // ["智能生成", "/"],
                  ["AI绘图", "/"],
                  ["GPT助手", "/"],
                ].map(([title, url], index) => (
                  <Link
                    key={index}
                    href={url}
                    className='px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-slate-200 hover:text-slate-900 active:bg-black active:text-white focus:outline-none focus:bg-black focus:text-white'
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className='hidden md:block'>
            <div className='flex items-center ml-4 md:ml-6 '>
              <Link
                href='/'
                className='px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-slate-200 hover:text-slate-900 '
              >
                登录
              </Link>
              <Link
                href='/'
                className='px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-slate-200  '
              >
                注册
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}

          <div className='flex -mr-2 md:hidden'>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className='inline-flex items-center justify-center p-2 text-gray-800 transition duration-150 ease-in-out bg-gray-200 rounded-md hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:bg-gray-300 focus:text-gray-900'
              aria-label='Menu'
            >
              <Image src={menu} alt='menu' />
            </button>
          </div>
        </nav>
        {showMenu && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 sm:px-3'>
              {[
                ["智能生成", "/"],
                ["AI绘图", "/"],
                ["GPT助手", "/"],
              ].map(([title, url], index) => (
                <Link
                  key={index}
                  href={url}
                  className='px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-slate-100 hover:text-slate-900'
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
