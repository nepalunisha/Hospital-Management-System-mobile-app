import { useState } from "react";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { useToast } from "@/hooks/use-toast";

const UploadDocuments = () => {
  const [claimNumber, setClaimNumber] = useState("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleUpload = async () => {
    if (!claimNumber.trim()) {
      alert("Please enter Claim Number");
      return;
    }
    if (!fileName) {
      alert("Please choose a file first");
      return;
    }

    const { value } = await Preferences.get({ key: "uploadedFiles" });
    const files = value ? JSON.parse(value) : [];

    files.push({ claimNumber, fileName, uploadedAt: new Date().toISOString() });

    toast({ title: "Uploaded Succesfully", description: `Document of ${claimNumber} submitted successfully!` });

    setClaimNumber("");
    setFileName("");
    navigate("/staff-home");
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-[#e0f0ff] flex flex-col items-center p-4">
      {/* Header */}
      <div className="flex items-center w-full max-w-sm mt-6 gap-8">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer"
          onClick={() => navigate("/staff-home")}
        />
        <h2 className="text-xl font-bold text-[#1ebac1]">Upload Document
        </h2>
      </div>

      <div className="w-full max-w-md p-6 rounded-2xl mt-6">
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">Claim Number</label>
          <input
            type="text"
            placeholder="Enter Claim Number"
            value={claimNumber}
            onChange={(e) => setClaimNumber(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1 text-sm"
          />
        </div>

        {/* Upload  */}
        <div className="mb-4">
          <label className="text-sm font-medium">
            <FileText className="inline h-4 w-4 mr-1" />
            Upload File
          </label>

          <div className="border-2 border-dashed p-5 mt-2 rounded-xl text-center">
            <Upload className="h-8 w-8 text-[#1ebac1] mx-auto" />
            <label className="cursor-pointer mt-2 inline-block">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <span className="underline text-[#1ebac1]">Choose File</span>
            </label>
            <p className="text-xs mt-1">{fileName || "No file chosen"}</p>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="bg-[#1ebac1] text-white p-3 rounded-xl w-full mt-3 text-lg"
        >
          Submit Document
        </button>
    </div>
    </div>
  );
};

export default UploadDocuments;
