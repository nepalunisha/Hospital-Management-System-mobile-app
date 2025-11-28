import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useClaims } from "./ClaimsContext";

const ViewClaims: React.FC = () => {
  const { claims } = useClaims();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-10 px-4">
      {/* Back Button */}
      <div className="absolute top-6 left-4 mt-8">
        <button
          onClick={() => navigate("/staff-dashboard")}
          className="flex items-center gap-2 text-[#1ebac1] font-semibold text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-xl font-bold text-[#1ebac1]">
            View Submitted Claims
          </span>
        </button>
      </div>

      {/* Claims List */}
      <div className="flex flex-col mt-20 gap-4">
        {claims.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No claims submitted yet.
          </p>
        )}

        {claims.map((c, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{c.patient?.name}</p>
              <p className="text-xs text-gray-500">{c.createdAt}</p>
            </div>

            {/* Claim Info */}
            <div className="flex justify-between text-xs text-gray-600">
              <span>Claim Code: {c.claimCode}</span>
              <span>Amount: {c.totalAmount?.toFixed(2) || "-"}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Status: {c.responseStatus}</span>
              <span>Outcome: {c.outcome}</span>
            </div>

            {/* Uploaded Document */}
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-block bg-[#1ebac1] text-white px-3 py-1 rounded text-xs">
                {c.prescriptionFileName || "No Document Uploaded"}
              </span>

              {c.prescriptionFileBase64 && (
                <a

                  href={c.prescriptionFileBase64}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline text-[#1ebac1]"
                >
                  View Document
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewClaims;
