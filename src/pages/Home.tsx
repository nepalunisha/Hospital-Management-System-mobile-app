import { useNavigate } from "react-router-dom";
import { User, Stethoscope } from "lucide-react";
import { Preferences } from "@capacitor/preferences";
import Logo from "../components/ui/Logo.png";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = async (path: string, type: string) => {
    await Preferences.set({ key: "lastLoginType", value: type });
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8f9ff]">

      {/* Header  */}
      <div className="w-full bg-[#1ebac1] pt-12 pb-10 flex flex-col items-center shadow-md">
        <img
          src={Logo}
          alt="logo"
          className="w-40 h-40 rounded-full bg-white p-3 shadow-xl"
        />

        <h1 className="text-3xl font-bold text-white mt-4">HMS</h1>
        <p className="text-white text-lg opacity-90 mt-1">
          Insurance Portal
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-10 space-y-6">

        {/* STAFF BUTTON */}
        <button
          onClick={() => handleNavigate("/staff-login", "staff")}
          className="w-full max-w-sm bg-[#1ebac1] border-2 border-white text-white rounded-2xl py-4 px-5 shadow
                     flex items-center gap-4 justify-center transition-transform hover:scale-[1.03]"
        >
          <div className="bg-white p-2 rounded-xl">
            <Stethoscope className="w-8 h-8 text-[#1ebac1]" />
          </div>
          <span className="text-xl font-semibold">Staff</span>
        </button>

        {/* PATIENT BUTTON */}
        <button
          onClick={() => handleNavigate("/patient-login", "patient")}
          className="w-full max-w-sm bg-white border-2 border-[#1ebac1] text-[#1ebac1] rounded-2xl py-4 px-5 shadow
                     flex items-center gap-4 justify-center transition-transform hover:scale-[1.03]"
        >
          <div className="bg-[#1ebac1] p-2 rounded-xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <span className="text-xl font-semibold">Patient</span>
        </button>

        <p className="absolute bottom-5 w-full text-center text-xs text-[#1ebac1]">2025© NIRC.All Rights Reserved</p>

      </div>
    </div>
  );
};

export default Home;
