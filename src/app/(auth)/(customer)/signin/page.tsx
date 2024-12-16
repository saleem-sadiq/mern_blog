import SignIn from "@/components/auth/SignIn";
import { MyImage } from "@/components/(frontend)";
import { auth } from "../../../../../public/auth";


const page = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-default200 py-10 xl:py-0"
      // style={{
      //   backgroundImage:
      //     "linear-gradient(to right top, #6024ff, #5256ff, #5578ff, #6894ff, #86adff, #7ebeff, #81cdff, #8fdaff, #72e4ff, #50eeff, #26f7fe, #02fff0)",
      // }}
    >
      {" "}
      <div className="w-11/12 xl:w-[60rem] xl:grid items-center justify-center overflow-hidden grid-cols-12 bg-white rounded-3xl max-w-[90%] mx-auto">
        <div className="hidden xl:flex flex-col items-center justify-center h-full col-span-6 bg-blue-200">
          <MyImage
            src={auth}
            alt="Authentication Image"
            width={10000}
            height={10000}
            className="w-96 h-96 object-contain"
          />
        </div>
        <div className="col-span-6 xl:p-10">
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
