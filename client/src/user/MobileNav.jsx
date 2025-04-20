import React, { useContext, useState, useEffect } from "react";
import {
  MdHomeFilled,
  TbTransactionRupee,
  MdAccountCircle,
  MdShoppingCart,
  MdCreditCard,
  MdSettings,
  FiBox
} from "../icons";
import { Link } from "react-router-dom";
import { MobileNavContext, PcNavContext } from "./UserLayout";
function MobileNav() {
  // const [menu, setMenu] = useState(() => {
  //   const localUserMenu = localStorage.getItem("userMenu");
  //   return localUserMenu ? Number(localUserMenu) : 0;
  // });

  // useEffect(() => {
  //   console.log("hiie");
  //   localStorage.setItem("userMenu", JSON.stringify(menu));
  // }, [menu]);

  const { menu, setMenu } = useContext(PcNavContext);

  const { isMobileNavActive, setIsMobileNavActive } =
    useContext(MobileNavContext);

  const [userRole, setUserRole] = useState('USER');

  useEffect(() => {
    try {
      const localStorageUserData = localStorage.getItem('userData')
      const parsedLocalStorageUserData = JSON.parse(localStorageUserData);
      setUserRole(parsedLocalStorageUserData.role)
      // console.log('parsedLocalStorageUserData',parsedLocalStorageUserData)
    } catch (error) {
      console.log("Error is ", Error);

    }
  }, [])

  return (
    <div className="w-full h-auto p-2 ">
      <ul className="flex flex-col w-full  justify-center items-center gap-4 py-3 ">
        {/* dashboard */}
        <li className=" w-full  flex justify-end items-center ">
          <Link
            onClick={() => {
              setIsMobileNavActive(!isMobileNavActive);
              setMenu(0);
            }}
            to={"/user/dashboard"}
            className="flex items-center justify-start gap-1 w-[65%]  "
          >
            <MdHomeFilled />
            <h3>Dashboard</h3>
          </Link>
        </li>

        {/* Products */}
        <li className="w-full  flex justify-end items-center ">
          {userRole == 'ADMIN' ? <Link
            onClick={() => {
              setIsMobileNavActive(!isMobileNavActive);
              setMenu(1);
            }}
            to={"/user/products"}
            className="flex items-center justify-start gap-1 w-[65%]"
          >
            <FiBox />
            <h3>Products</h3>
          </Link> : null}

        </li>

        {/* Accounts */}
        <li className="w-full flex justify-end items-center ">
          <Link
            onClick={() => {
              setIsMobileNavActive(!isMobileNavActive);
              setMenu(2);
            }}
            to={"/user/accounts"}
            className="flex items-center justify-start gap-1 w-[65%]"
          >
            <MdAccountCircle />
            <h3>Accounts</h3>
          </Link>
        </li>

        {/* Orders */}
        <li className="w-full  flex justify-end items-center">
          <Link
            onClick={() => {
              setIsMobileNavActive(!isMobileNavActive);
              setMenu(3);
            }}
            to={"/user/orders"}
            className="flex items-center justify-start gap-1 w-[65%]"
          >
            <MdShoppingCart />
            <h3>Orders</h3>
          </Link>
        </li>

        {/* Cards */}
        <li className="w-full flex justify-end items-center">
          <Link
            onClick={() => {
              setIsMobileNavActive(!isMobileNavActive);
              setMenu(4);
            }}
            to={"/user/cards"}
            className="flex items-center justify-start gap-1 w-[65%]"
          >
            <MdCreditCard />
            <h3>Cards</h3>
          </Link>
        </li>

        {/* Settings */}
        <li className="w-full flex justify-end items-center">
          <Link
            onClick={() => {
              setIsMobileNavActive(!isMobileNavActive);
              setMenu(5);
            }}
            to={"/user/settings"}
            className="flex items-center justify-start gap-1  w-[65%]"
          >
            <MdSettings />
            <h3>Settings</h3>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default MobileNav;
