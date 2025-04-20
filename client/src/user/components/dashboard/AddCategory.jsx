import { useContext } from "react"
import { RxCross2 } from "../../../icons"
import { AddCategoryContext } from "../Dashboard"
export default function AddCategory() {

    const { isAddCategoryActive, setIsAddCategoryActive } = useContext(AddCategoryContext);

    return (<div className="w-full z-[999]  bg-slate-900/80 h-full absolute flex  justify-center items-center border">


        <div className="relative w-full  md:w-1/2 md:h-[70%]  bg-white rounded-3xl p-3">


            <RxCross2 onClick={() => setIsAddCategoryActive(false)} className="absolute top-3 right-3 text-4xl font-bold text-red-400 cursor-pointer" />

            {/* Add category container */}
            <div className=" h-full w-full  flex flex-col items-center justify-between ">
                {/* heading */}
                <h1 className=" w-full text-center text-xl font-semibold">Add Category</h1>

                {/* input and submit */}
                <div className="flex flex-col items-center justify-center h-[90%]  w-full gap-2" >

                    <img className="md:w-[50%] w-[60%]" src="https://ik.imagekit.io/8fgpvoiai/grocery-store/output-onlinegiftools_qt4-hROS74.gif?updatedAt=1745159140577" alt="" />

                    <div className=" flex flex-col items-center w-full gap-4">


                        <input className=" outline-none bg-slate-800  font-semibold h-14 rounded-xl p-2 w-[70%] text-green-400" type="text" name="" id="" />
                        <input className="w-[70%] rounded-xl p-2 bg-green-400 font-semibold text-white h-14 hover:cursor-pointer hover:bg-slate-900 hover:text-green-400 hover:font-bold transition-all ease-linear duration-500" type="submit" value="Add Category" />
                    </div>
                </div>

            </div>
        </div>



    </div>)
}