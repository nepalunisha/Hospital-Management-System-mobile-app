import React, { useState } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo
} from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { ArrowLeft, Camera as CameraIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  claimNumber: string;
  fileName: string;
  uploadedAt: string;
  photos: string[];
}

const UploadDocuments: React.FC = () => {
  const [claimNumber, setClaimNumber] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

  const openPicker = async (): Promise<void> => {
    try {
      if (Capacitor.isNativePlatform()) {
        const image: Photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt,
          promptLabelHeader: "Upload Document",
          promptLabelCancel: "Cancel",
          promptLabelPhoto: "Choose Photo",
          promptLabelPicture: "Take Photo"
        });

        if (image.dataUrl) {
          setPhotos((prev) => [...prev, image.dataUrl!]);
          setFileNames((prev) => [
            ...prev,
            image.format ? `photo.${image.format}` : "photo.jpg"
          ]);
        }
        return;
      }
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;

      input.onchange = (e: Event) => {
        const fileList = (e.target as HTMLInputElement).files;
        if (!fileList) return;

        Array.from(fileList).forEach((file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            setPhotos((prev) => [...prev, reader.result as string]);
            setFileNames((prev) => [...prev, file.name]);
          };
          reader.readAsDataURL(file);
        });
      };

      input.click();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to open picker";

      if (message.includes("cancelled")) return;

      toast({
        title: "Error",
        description: "Failed to open camera/gallery",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!claimNumber.trim()) {
      toast({
        title: "Missing Claim Number",
        description: "Please enter a claim number",
        variant: "destructive"
      });
      return;
    }

    if (photos.length === 0) {
      toast({
        title: "No Photos",
        description: "Please upload at least one photo",
        variant: "destructive"
      });
      return;
    }

    const existing = await Preferences.get({ key: "uploadedFiles" });
    const files: UploadedFile[] = existing.value
      ? JSON.parse(existing.value)
      : [];

    files.push({
      claimNumber,
      fileName: fileNames.join(", "),
      uploadedAt: new Date().toISOString(),
      photos
    });

    await Preferences.set({
      key: "uploadedFiles",
      value: JSON.stringify(files)
    });

    toast({
      title: "Success",
      description: `Uploaded ${photos.length} document(s) successfully`
    });

    setClaimNumber("");
    setFileNames([]);
    setPhotos([]);
    navigate("/staff-home");
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center p-4 pb-28">
      <div className="flex items-center w-full max-w-sm mt-6 gap-3">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer"
          onClick={() => navigate("/staff-dashboard ")}
        />
        <h2 className="text-xl font-bold text-[#1ebac1]">Upload Document</h2>
      </div>

      <div className="w-full max-w-sm mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Claim Number
        </label>
        <input
          type="text"
          placeholder="Enter Claim Number"
          value={claimNumber}
          onChange={(e) => setClaimNumber(e.target.value)}
          className="w-full px-3 py-2 border border-[#1ebac1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ebac1] text-sm"
        />
      </div>
      <button
        onClick={openPicker}
        className="mt-8 w-full max-w-sm bg-white border-2 border-dashed border-[#1ebac1] rounded-xl p-10 text-center hover:bg-[#f8fdff] transition-shadow hover:shadow-md"
      >
        <CameraIcon className="mx-auto h-8 w-8 text-[#1ebac1]" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          {photos.length > 0 ? "Add More Photos" : "Take Photo"}
        </p>
        {fileNames.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {fileNames.length} file(s) selected
          </p>
        )}
      </button>

      {photos.length > 0 && (
        <div className="mt-6 w-full max-w-sm grid grid-cols-2 gap-4 pb-32">
          {photos.map((p, index) => (
            <div key={index} className="border rounded-lg p-1 bg-white shadow">
              <img
                src={p}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-contain rounded"
              />
              <p className="text-xs text-center mt-1">{fileNames[index]}</p>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4">
          <button
            onClick={handleUpload}
            className="w-full max-w-sm mx-auto block bg-[#1ebac1] text-white font-semibold py-3 rounded-xl text-lg hover:bg-[#17a2a9] transition"
          >
            Submit Documents
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;
