import { useState } from "react";
import {
  Upload,
  FileText,
  Camera as CameraIcon,
  ArrowLeft,
  Image as GalleryIcon,
} from "lucide-react";
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
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setPhoto(image.dataUrl!);
      setFileName("captured-photo.jpg");
      setShowOptions(false);
    } catch (error) {
      console.log(error);
    }
  };

  const pickFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      setPhoto(image.dataUrl!);
      setFileName("gallery-photo.jpg");
      setShowOptions(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async () => {
    if (!claimNumber.trim()) {
      alert("Please enter Claim Number");
      return;
    }
    if (!fileName || !photo) {
      alert("Please choose or capture a document first");
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

    await Preferences.set({
      key: "uploadedFiles",
      value: JSON.stringify(files),
    });

    toast({
      title: "Uploaded Successfully",
      description: `Document for claim #${claimNumber} submitted.`,
    });

    setClaimNumber("");
    setFileName("");
    setPhoto(null);
    navigate("/staff-home");
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center p-4 pb-28">
      <div className="flex items-center w-full max-w-sm mt-6 gap-3">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer"
          onClick={() => navigate("/staff-home")}
        />
        <h2 className="text-xl font-bold text-[#1ebac1]">Upload Document</h2>
      </div>

      <div className="w-full max-w-sm mt-6">
        <label className="text-sm text-gray-700 font-semibold">Claim Number</label>
        <input
          type="text"
          placeholder="Enter Claim Number"
          value={claimNumber}
          onChange={(e) => setClaimNumber(e.target.value)}
          className="w-full border border-[#1ebac1] rounded-lg p-2 mt-1 text-sm focus:ring-2 focus:ring-[#1ebac1]"
        />
      </div>

      <div
        className="w-full max-w-sm mt-6 bg-white border border-[#1ebac1] rounded-xl p-6 text-center cursor-pointer shadow-sm hover:shadow-md transition relative"
        onClick={() => setShowOptions(!showOptions)}
      >
        <CameraIcon className="h-10 w-10 text-[#1ebac1] mx-auto" />
        <p className="text-gray-600 text-sm mt-2">
          Take Photo 
        </p>

        {showOptions && (
          <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg mt-2 py-2 z-20">
            <button
              onClick={takePhoto}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#e8faff]"
            >
              <CameraIcon className="h-5 w-5 text-[#1ebac1]" /> Take Photo
            </button>

            <button
              onClick={pickFromGallery}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#e8faff]"
            >
              <GalleryIcon className="h-5 w-5 text-[#1ebac1]" /> Upload from Gallery
            </button>
          </div>
        )}
      </div>

      {photo && (
        <div className="mt-4 w-full max-w-sm text-center">
          <p className="text-sm text-gray-700 mb-1">Preview:</p>
          <img
            src={photo}
            className="w-full h-44 object-contain rounded-lg border"
          />
        </div>
      )}

      {photo && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4">
          <button
            onClick={handleUpload}
            className="w-full bg-[#1ebac1] text-white py-3 rounded-xl text-lg"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;
