export default function DashboardProduct() {

    return (<div className="flex flex-col h-full justify-center items-center">


        <h1 className="text-xl font-semibold"> Dashboard Product</h1>

        {/* content */}
        <div className="w-full h-[90%] border bg-white rounded-xl p-2">

            <div className="flex gap-8 font-semibold w-full border px-12">
                <h1 className="hover:text-green-400 cursor-pointer">Sell</h1>

                <h1 className="hover:text-green-400 cursor-pointer">Buy</h1>
            </div>
            <table className="table-auto  w-full hidden">

                <thead className="border-b-2 font-bold" >
                    <tr>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>)
}