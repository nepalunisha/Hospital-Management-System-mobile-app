import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { useClaims } from "./ClaimsContext";
import { useState, useEffect } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import NepaliDate from "nepali-date-converter";
import "nepali-datepicker-reactjs/dist/index.css";

const ViewClaims: React.FC = () => {
  const { claims } = useClaims();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filteredClaims, setFilteredClaims] = useState(claims);

  useEffect(() => {
    try {
      const today = new NepaliDate().format("YYYY-MM-DD");
      setStartDate(today);
      setEndDate(today);
    } catch (error) {
      console.error("Failed to set Nepali date:", error);
      setStartDate("2082-08-15");
      setEndDate("2082-08-15");
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredClaims(claims);
      return;
    }

    const filtered = claims.filter((c) => {
      const adDate = new Date(c.createdAt);
      const bsDate = new NepaliDate(adDate).format("YYYY-MM-DD");
      return bsDate >= startDate && bsDate <= endDate;
    });

    setFilteredClaims(filtered);
  }, [startDate, endDate, claims]);

  const openDocument = (base64: string, fileName?: string) => {
    if (!base64) return;

    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const fileType = fileName?.split(".").pop()?.toLowerCase();
    const mimeType =
      fileType === "png" || fileType === "jpg" || fileType === "jpeg"
        ? `image/${fileType}`
        : "application/pdf";

    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-10 px-4">
      <div className="absolute top-6 left-4 mt-8">
        <button
          onClick={() => navigate("/staff-dashboard")}
          className="flex items-center gap-2 text-[#1ebac1] font-semibold text-base"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="text-xl font-bold text-[#1ebac1] ml-2">
            View Submitted Claims
          </span>
        </button>
      </div>

      <div className="mt-28 mb-4 flex items-center gap-2">
        <div className="relative w-full h-8">
          <NepaliDatePicker
            value={startDate}
            onChange={(date: string) => setStartDate(date)}
            inputClassName="border border-[#1ebac1] rounded-xl px-2 py-1 w-full pr-10"
          />
          <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1ebac1] pointer-events-none" />
        </div>
        <button
          onClick={() => {
            const today = new NepaliDate().format("YYYY-MM-DD");
            setStartDate(today);
            setEndDate(today);
          }}
          className="bg-[#1ebac1] text-white px-3 py-1 rounded-xl text-sm hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredClaims.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No claims submitted for selected date.
          </p>
        )}

        {filteredClaims.map((c, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{c.patient?.name}</p>
              <p className="text-xs text-gray-500">{c.createdAt}</p>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Claim Code: {c.claimCode}</span>
              <span>Amount: {c.totalAmount?.toFixed(2) || "-"}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Status: {c.responseStatus}</span>
              <span>Outcome: {c.outcome}</span>
            </div>

            <div className="mt-2">
              {c.prescriptionFileBase64 ? (
                <button
                  onClick={() =>
                    openDocument(c.prescriptionFileBase64, c.prescriptionFileName)
                  }
                  className="inline-block bg-[#1ebac1] text-white px-3 py-1 rounded text-xs cursor-pointer"
                >
                  {c.prescriptionFileName || "Open Document"}
                </button>
              ) : (
                <span className="inline-block bg-[#1ebac1] text-white px-3 py-1 rounded text-xs">
                  No Document Uploaded
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewClaims;
