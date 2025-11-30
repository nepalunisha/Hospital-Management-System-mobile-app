import { useNavigate } from "react-router-dom";
import { Upload, FileText, Send, ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

const StaffHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const options = [
    { name: "Prepare Claim", path: "/staff-dashboard" },
    { name: "Claim History", path: "/View-Claims" },
    { name: "Upload Documents", path: "/upload-documents" },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === "") {
      setFilteredOptions([]);
    } else {
      const filtered = options.filter((opt) =>
        opt.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const handleOptionClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setFilteredOptions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-[#e0f0ff] flex flex-col items-center p-4">
      
      {/* Back*/}
      <div className="flex items-center w-full max-w-sm mt-6 gap-14">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer"
          onClick={() => navigate("/staff-login")}
        />
        <h1 className="text-xl flex items-center w-full max-w-sm font-bold text-[#1ebac1]">
          Insurance Dashboard
        </h1>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-[#1ebac1]">Choose an option to proceed</p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md w-full">
        <div className="flex items-center bg-white rounded-xl border border-[#1ebac1] px-4 py-2 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 outline-none px-2 py-1 text-[#1ebac1]"
          />
          <Search className="h-6 w-6 text-[#1ebac1]" />
        </div>

        {/* Suggestion  */}
        {filteredOptions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-[#1ebac1] rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredOptions.map((opt, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-[#e0f0ff]"
                onClick={() => handleOptionClick(opt.path)}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*  Buttons */}
      <div className="flex items-center gap-2 relative">
        
        {/* Prepare Claim */}
        <div
          onClick={() => navigate("/staff-dashboard")}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="bg-[#1ebac1] text-white rounded-full p-2 shadow-lg flex items-center justify-center hover:[#1ebac1] hover:scale-110 transition-transform">
            <Send className="h-5 w-5" />
          </div>
          <span className="mt-2 text-[#1ebac1] text-sm font-medium text-center">
            Prepare Claim
          </span>
        </div>

        {/* Claim History */}
        <div
          onClick={() => navigate("/View-Claims")}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="bg-[#1ebac1] text-white rounded-full p-2 shadow-lg flex items-center justify-center hover:[#1ebac1] hover:scale-110 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
          <span className="mt-2 text-[#1ebac1] text-sm font-medium text-center">
            Claim History
          </span>
        </div>

        {/* Upload Documents */}
        <div
          onClick={() => navigate("/upload-documents")}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="bg-[#1ebac1] text-white rounded-full p-2 shadow-lg flex items-center justify-center hover:[#1ebac1] hover:scale-110 transition-transform">
            <Upload className="h-5 w-5" />
          </div>
          <span className="mt-2 text-[#1ebac1] text-sm font-medium text-center">
            Upload Documents
          </span>
        </div>

        
        <div className="flex flex-col items-center w-16"></div>
      </div>
    </div>
  );
};

export default StaffHome;
