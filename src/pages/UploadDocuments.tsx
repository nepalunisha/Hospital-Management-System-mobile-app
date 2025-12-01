import { useState } from "react";
import { Upload, FileText, Camera as CameraIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const UploadDocuments = () => {
  const [claimNumber, setClaimNumber] = useState("");
  const [fileName, setFileName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPhoto(URL.createObjectURL(file));
      setShowOptions(false);
    }
  };

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      setPhoto(image.dataUrl!);
      setFileName("photo.jpg");
      setShowOptions(false);
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const handleUpload = async () => {
    if (!claimNumber.trim()) {
      alert("Please enter Claim Number");
      return;
    }
    if (!fileName || !photo) {
      alert("Please choose or capture a file first");
      return;
    }

    const { value } = await Preferences.get({ key: "uploadedFiles" });
    const files = value ? JSON.parse(value) : [];

    files.push({
      claimNumber,
      fileName,
      uploadedAt: new Date().toISOString(),
      photoData: photo,
    });

    await Preferences.set({ key: "uploadedFiles", value: JSON.stringify(files) });

    toast({
      title: "Uploaded Successfully",
      description: `Document of claim no.${claimNumber} submitted successfully!`,
    });

    setClaimNumber("");
    setFileName("");
    setPhoto(null);
    navigate("/staff-home");
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center p-4">
      {/* Header */}
      <div className="flex items-center w-full max-w-sm mt-6 gap-3">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer hover:text-[#17a2a8] transition"
          onClick={() => navigate("/staff-home")}
        />
        <h2 className="text-xl font-bold text-[#1ebac1]">Upload Document</h2>
      </div>

      {/* Claim Number */}
      <div className="w-full max-w-sm mt-6">
        <label className="text-sm text-gray-700 font-semibold">Claim Number</label>
        <input
          type="text"
          placeholder="Enter Claim Number"
          value={claimNumber}
          onChange={(e) => setClaimNumber(e.target.value)}
          className="w-full border border-[#1ebac1] rounded-lg p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1ebac1]"
        />
      </div>
      
      {/* Upload Box */}
      <div
        className="w-full max-w-sm mt-4 border-2 border-dashed border-[#1ebac1] rounded-xl p-6 text-center cursor-pointer hover:border-[#1ebac1] transition relative bg-white"
        onClick={() => setShowOptions(!showOptions)}
      >
        <Upload className="h-8 w-8 text-[#1ebac1] mx-auto mb-2" />
        <p className="text-gray-500 text-sm">
          Click to upload <br /> Drag and drop files here
        </p>

        {showOptions && (
          <div className="absolute top-full left-0 w-full bg-white border shadow-lg rounded-lg mt-2 z-10">
            <button
              onClick={takePhoto}
              className="w-full text-left px-4 py-2 hover:bg-[#e0f4ff] flex items-center gap-2"
            >
              <CameraIcon className="h-4 w-4 text-[#1ebac1]" /> Take Photo
            </button>
            <label className="w-full text-left px-4 py-2 hover:bg-[#e0f4ff] flex items-center gap-2 cursor-pointer">
              <FileText className="h-4 w-4 text-[#1ebac1]" /> Upload from Gallery
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <label className="w-full text-left px-4 py-2 hover:bg-[#e0f4ff] flex items-center gap-2 cursor-pointer">
              <FileText className="h-4 w-4 text-[#1ebac1]" /> Upload from your Files
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        )}
      </div>

      {/* Preview */}
      {photo && (
        <div className="mt-4 text-center w-full max-w-sm">
          <p className="text-sm text-gray-700 mb-1">Preview:</p>
          <img
            src={photo}
            alt="Preview"
            className="w-full h-40 object-contain rounded-md border"
          />
        </div>
      )}

      {/* Upload Button */}
      {photo && fileName && (
        <button
          onClick={handleUpload}
          className="mt-4 w-full max-w-sm bg-[#1ebac1] text-white py-2 rounded-lg hover:bg-[#1ebac1] transition"
        >
          Submit
        </button>
      )}
    </div>

  );
};

export default UploadDocuments;
