import React, { useState, useContext, createContext, useEffect } from "react";
import {
  MdOutlineSettings,
  LuBellDot,
  MdOutlineHome,
  RxHamburgerMenu,
  RxCross2,
  MdOutlineAdd
} from "../../icons";
import { Link } from "react-router-dom";
import { MobileNavContext } from "../UserLayout";
import { AddCategory,DashboardProduct } from "./dashboard";

export const AddCategoryContext = createContext();

function Dashboard() {
  const { isMobileNavActive, setIsMobileNavActive } =
    useContext(MobileNavContext);

  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [isAddCategoryActive, setIsAddCategoryActive] = useState(false);



  // if (isAddCategoryActive) {
  //   return (<AddCategory />)
  // }

  useEffect(() => {
    console.log('isAddCategoryActive', isAddCategoryActive);

  }, [isAddCategoryActive])
  return (


    <div className=" w-full h-full flex flex-col bg-slate-200/50 selection:bg-transparent relative">

      <AddCategoryContext.Provider value={{ isAddCategoryActive, setIsAddCategoryActive }}>
        {isAddCategoryActive ? <AddCategory /> : null}
      </AddCategoryContext.Provider>
      {/* header */}
      <div className="w-full h-[10%]  flex items-center justify-between p-4 bg-white border-2 border-slate-200/50">
        <div
          onClick={() => setIsMobileNavActive(!isMobileNavActive)}
          className=" text-2xl font-extrabold md:hidden inline-block"
        >
          <RxHamburgerMenu />
        </div>

        {/* page title */}
        <h2 className="font-semibold text-green-400 md:text-xl">Dashboard</h2>

        {/* header icons */}
        <div className=" flex gap-4">
          {/* home button container */}
          <Link className="rounded-full" to={"../../"}>
            <div className="p-2 bg-black rounded-full flex justify-center items-center">
              <MdOutlineHome className="text-2xl font-semibold text-green-400" />
            </div>
          </Link>

          {/* setting button container*/}
          <Link
            onClick={() => {
              console.log("hi", menu);
              // setMenu(5)
            }}
            to={"../settings"}
            className="hidden  border-black border-2 bg-slate-300 cursor-pointer"
          >
            <div className="p-2 bg-slate-200/50 hover:bg-black border border-red-400  rounded-full flex justify-center items-center">
              <MdOutlineSettings className="text-2xl font-semibold text-green-400 " />
            </div>
          </Link>

          {/* notification container */}
          <div className="p-2  bg-slate-200/50 rounded-full flex justify-center items-center relative selection:bg-transparent">
            <LuBellDot
              onClick={() => setIsNotificationActive(!isNotificationActive)}
              className="text-2xl cursor-pointer font-semibold text-red-400 z-50"
            />

            <div
              className={`${!isNotificationActive && "bg-transparent p-0 border-none"
                } absolute border-2 bg-black p-6 rounded-full border-green-400 transition-all ease-linear duration-500`}
            ></div>

            {/* notification container wrapper */}
            <div
              className={`${!isNotificationActive && "h-0 w-0 border-none bg-transparent "
                } absolute top-12 -left-24 h-[200px] w-[200px] border-2 bg-black/70 text-green-400 rounded-lg p-2 border-green-400 transition-all ease-linear duration-500`}
            ></div>
          </div>

          {/* user profile container */}
          <div className="w-10 rounded-full border-2 border-green-400">
            <img
              className="w-full rounded-full"
              src="https://randomuser.me/api/portraits/men/59.jpg"
              alt="error_loading_image"
            />
          </div>
        </div>
      </div>

      {/* body wrapper*/}
      <div className="w-full h-[90%]">
        {/* body container */}
        <div className="w-[90%] mx-auto  h-full  flex flex-col p-1">

          {/* upper container */}
          <div className="w-full  h-1/2 flex  justify-between items-center p-1">
            {/* upper left container */}
            <div className="w-1/2 h-full   flex justify-between items-center p-1">

              {/* trending products container*/}
              <div className="p-1 h-full  w-1/2 flex flex-col justify-between items-center">


                {/* trending products heading section*/}
                <div className=" w-full flex justify-between items-center px-2 h-[5%]">

                  <h1 className="font-bold">Trending Products</h1>
                  <p className="font-semibold">See all</p>
                </div>

                {/* trending products content container */}
                <div className="w-full bg-white h-[90%] rounded-xl p-2">
                  {/* upper table heading */}
                  <table className="table-auto  w-full">
                    <thead className="border-b-2 font-bold">
                      <tr className="text-[16px]">
                        <th>Description</th>
                        <th>Rating</th>
                        <th>Sales</th>
                        <th>Profit</th>
                      </tr>
                    </thead>

                    <tbody className="text-[15px] font-semibold">
                      <tr className="text-center">
                        <td>Demo Desc</td>
                        <td>4.9</td>
                        <td>9,000</td>
                        <td className="text-green-400">+$300</td>
                      </tr>

                      <tr className="text-center">
                        <td>Demo Desc 2</td>
                        <td>4.1</td>
                        <td>2,000</td>
                        <td className="text-red-400">-$100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>


              {/* Product Categories */}
              <div className="p-1 h-full w-1/2 flex  flex-col justify-between items-center ">

                {/* product categories heading section */}
                <div className="h-[5%] flex justify-between items-center w-full p-1">
                  {/* product categories heading left */}
                  <div className="flex items-center  justify-start gap-3 p-1">

                    <h1 className="font-semibold">Categories</h1>
                    <MdOutlineAdd
                      onClick={() => setIsAddCategoryActive(true)}

                      className="tet-xl font-bold border-2 rounded-full border-green-400 cursor-pointer
                    "/>
                  </div>

                  <h2 className="font-semibold">See all</h2>
                </div>


                {/* product categories content section */}
                <div className="h-[90%] w-full bg-white rounded-xl p-2">

                  <table className="table-auto  w-full">
                    <thead className="border-b-2 font-bold">
                      <tr className="text-[16px]">
                        <th>Description</th>
                        <th>Products</th>
                        <th>Sales</th>
                      </tr>
                    </thead>

                    <tbody className="text-[15px] font-semibold">
                      <tr className="text-center">
                        <td>Demo Desc</td>
                        <td>200</td>
                        <td>30000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


              </div>
            </div>

            {/* upper right container */}
            <div className="w-1/2 h-full border p-1">
            <DashboardProduct/> 
            </div>
          </div>

          {/* lower container */}
          <div className="w-full border h-1/2 flex justify-between items-center">
            {/* lower left container */}
            <div className="w-1/2 h-full border">adsf</div>

            {/* lower right container */}
            <div className="w-1/2 h-full border">asdf</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
