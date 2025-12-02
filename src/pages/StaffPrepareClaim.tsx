import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Camera as CameraIcon } from "lucide-react";
import Logo from "../components/ui/Logo.png";
import { useClaims } from "./ClaimsContext";
import { Card, CardContent } from "@/components/ui/card";

const billData = {
  hospital: {
    name: "HMS",
    address: "Kathmandu, Nepal",
    phone: "014567800",
    pan: "201515925",
  },
  patient: {
    id: 9,
    name: "unisha nepal",
    nshiNo: "124540145501",
  },
  invoice: {
    number: 11,
    date: "2025-11-17",
    claimCode: "10121230",
    generatedAt: "2025-11-17 03:47:21 PM",
    generatedBy: "Staff - selina sharma",
  },
  visits: [
    {
      id: 11,
      amount: 800.0,
      paymentStatus: "Pending",
      transactionDate: "2025-11-16 09:41:05 PM",
      medicine: "paracetamol",
      MedicationCode: "234",
      Unit: "2",
      Quantity: "5",
      TotalPrice: "800",
      SaleDate: "2025-11-16 09:41:05 PM",
      TestName: "Blood-Test",
      TestCode: "009",
      SN: "1",
      DiagnosisCode: "001",
      Details: "Cancer",
    },
  ],
};


const StaffPrepareClaim: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addClaim } = useClaims();
  const patient = location.state?.patient;

  const [claimCode, setClaimCode] = useState("");
  const [nmcNumber, setNmcNumber] = useState("");
  const [comments, setComments] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);


  const [showOptions, setShowOptions] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [claimData, setClaimData] = useState<any>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (!patient) {
      toast({ title: "Access Denied", variant: "destructive" });
      navigate("/staff-dashboard");
    } else {
      setClaimCode("CLM" + Date.now());
      setAccessGranted(true);
    }
  }, [navigate, patient, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
      setFileName(file.name);
    }
  };

  const takePhoto = () => {
    toast({ title: "Take Photo clicked" });
  };

  const handlePrepareClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nmcNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter NMC Number",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = billData.visits.reduce((a, v) => a + v.amount, 0);
    setClaimData({
      patient,
      claimCode,
      createdAt: new Date().toLocaleString(),
      prescriptionFileName: prescriptionFile?.name || "",
      prescriptionFileBase64: "",
      responseStatus: "Pending",
      outcome: "-",
      nmcNumber,
      comments,
      totalAmount,
    });

    setShowConfirmModal(true);
  };

  const finalizeClaim = async (data: any) => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      let base64File = "";
      if (prescriptionFile) {
        base64File = await fileToBase64(prescriptionFile);
      }
      await addClaim({ ...data, prescriptionFileBase64: base64File });

      toast({
        title: "Success",
        description: `Claim ${claimCode} prepared successfully!`,
      });

      setNmcNumber("");
      setComments("");
      setFileName("No file chosen");
      setPrescriptionFile(null);

      navigate("/staff-home");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare claim",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!accessGranted) return <p className="text-center mt-20">Checking access...</p>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-32 px-4 overflow-y-auto">

      <div className="fixed top-6 left-4 z-50">
        <button
          onClick={() => navigate("/staff-dashboard")}
          className="flex items-center gap-2 text-[#1ebac1] font-semibold text-base"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-20 max-w-2xl w-full mx-auto flex flex-col space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-[#00AEEF]">
          <p className="text-sm text-gray-600">Submitting claim for:</p>
          <p className="text-xl font-bold text-[#1ebac1] mt-1">
            {patient?.name} ({patient?.id})
          </p>
        </div>

        <form onSubmit={handlePrepareClaim} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700">Claim Code</label>
            <Input value={claimCode} readOnly className="bg-gray-100 text-lg font-mono" />
          </div>

          <div>
            <label className="text-sm text-gray-700">
              NMC Number <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter NMC Number"
              value={nmcNumber}
              onChange={(e) => setNmcNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm">Additional Comments</label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
        <label className="text-sm font-medium flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Doctor's Prescription
        </label>

        <div className="w-full max-w-sm mt-2 relative">
          <div
            className="border-2 border-dashed border-[#1ebac1] rounded-xl p-6 text-center cursor-pointer hover:border-[#1ebac1] transition bg-white"
            onClick={() => setShowOptions(!showOptions)}
          >
            <Upload className="h-8 w-8 text-[#1ebac1] mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              {prescriptionFile ? "File Uploaded succesfully" : "Click to upload  files here"}
            </p>
            <p className="text-xs mt-2">{fileName}</p>
          </div>

          {showOptions && (
            <div className="absolute top-full left-0 w-full bg-white border shadow-lg rounded-lg mt-2 z-10">
              <button
                type="button"
                onClick={takePhoto}
                className="w-full text-left px-4 py-2 hover:bg-[#e0f4ff] flex items-center gap-2"
              >
                <CameraIcon className="h-4 w-4 text-[#1ebac1]" /> Take Photo
              </button>

        <label className="w-full text-left px-4 py-2 hover:bg-[#e0f4ff] flex items-center gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-[#1ebac1]" /> Upload File
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPrescriptionFile(file);
                setFileName(file.name);
                setShowOptions(false); 
              }
            }}
          />
              </label>
            </div>
          )}
        </div>
      </div>

          {/* Bill  */}
          {["OPD", "Pharmacy", "Lab", "Diagnosis"].map((section) => (
            <Card key={section} className="mt-6 bg-transparent border border-gray-200">
              <CardContent>
                <h3 className="font-bold text-[#1ebac1] mb-2 text-xs">{section} Invoice / Bill</h3>
                <div className="flex flex-col items-center text-center space-y-1 mb-3">
                  <img src={Logo} alt="logo" className="w-8 h-8 object-contain" />
                  <p className="text-xs">{billData.hospital.name}</p>
                  <p className="text-xs">{billData.hospital.address}</p>
                  <p className="text-xs">Phone: {billData.hospital.phone}</p>
                  <p className="text-xs">PAN: {billData.hospital.pan}</p>
                  <p className="font-bold text-lg mt-1">INVOICE BILL</p>
                </div>

                 <div className="flex justify-between text-xs mb-2">
                  <div>
                    <p><strong>ID:</strong> {billData.patient.id}</p>
                    <p><strong>Name:</strong> {billData.patient.name}</p>
                    <p><strong>NSHI:</strong> {billData.patient.nshiNo}</p>
                  </div>
                  <div>
                    <p><strong>Invoice #:</strong> {billData.invoice.number}</p>
                    <p><strong>Date:</strong> {billData.invoice.date}</p>
                    <p><strong>Claim:</strong> {billData.invoice.claimCode}</p>
                  </div>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full border text-center">
                    <thead>
                      <tr className="bg-gray-200">
                        {section === "OPD" && (
                          <>
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">Amount</th>
                            <th className="border px-2 py-1">Status</th>
                            <th className="border px-2 py-1">Date</th>
                          </>
                        )}
                        {section === "Pharmacy" && (
                          <>
                            <th className="border px-1 py-1">Medicine</th>
                            <th className="border px-1 py-1">Code</th>
                            <th className="border px-1 py-1">Unit</th>
                            <th className="border px-1 py-1">Qty</th>
                            <th className="border px-1 py-1">Total</th>
                            <th className="border px-1 py-1">Sale Date</th>
                          </>
                        )}
                        {section === "Lab" && (
                          <>
                            <th className="border px-2 py-1">S.N</th>
                            <th className="border px-2 py-1">Test Code</th>
                            <th className="border px-2 py-1">Test Name</th>
                            <th className="border px-2 py-1">Unit</th>
                            <th className="border px-2 py-1">Quantity</th>
                            <th className="border px-2 py-1">Amount</th>
                          </>
                        )}
                        {section === "Diagnosis" && (
                          <>
                            <th className="border px-2 py-1">S.N</th>
                            <th className="border px-2 py-1">Diagnosis Code</th>
                            <th className="border px-2 py-1">Details</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {billData.visits.map((v) => (
                        <tr key={`${section}-${v.id}`}>
                          {section === "OPD" && (
                            <>
                              <td className="border px-1 py-1">{v.id}</td>
                              <td className="border px-1 py-1">{v.amount.toFixed(2)}</td>
                              <td className="border px-1 py-1">{v.paymentStatus}</td>
                              <td className="border px-1 py-1">{v.transactionDate}</td>
                            </>
                          )}
                          {section === "Pharmacy" && (
                            <>
                              <td className="border px-1 py-1">{v.medicine}</td>
                              <td className="border px-1 py-1">{v.MedicationCode}</td>
                              <td className="border px-1 py-1">{v.Unit}</td>
                              <td className="border px-1 py-1">{v.Quantity}</td>
                              <td className="border px-1 py-1">{v.TotalPrice}</td>
                              <td className="border px-1 py-1">{v.SaleDate}</td>
                            </>
                          )}
                          {section === "Lab" && (
                            <>
                              <td className="border px-1 py-1">{v.SN}</td>
                              <td className="border px-1 py-1">{v.TestCode}</td>
                              <td className="border px-1 py-1">{v.TestName}</td>
                              <td className="border px-1 py-1">{v.Unit}</td>
                              <td className="border px-1 py-1">{v.Quantity}</td>
                              <td className="border px-1 py-1">{v.amount}</td>
                            </>
                          )}
                          {section === "Diagnosis" && (
                            <>
                              <td className="border px-1 py-1">{v.SN}</td>
                              <td className="border px-1 py-1">{v.DiagnosisCode}</td>
                              <td className="border px-1 py-1">{v.Details}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-right text-sm mt-2 font-medium">
                  Total: Rs {billData.visits.reduce((a, v) => a + v.amount, 0).toFixed(2)}
                </p>
                <p className="text-right text-sm font-medium">
                  Generated By: {billData.invoice.generatedBy}
                </p>
                <p className="text-right text-sm font-medium">
                  Generated At: {billData.invoice.generatedAt}
                </p>
              </CardContent>
            </Card>
          ))}

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg z-50">

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1ebac1] text-white h-14 text-lg hover:[#1ebac1]  hover:bg-[#1ebac1]"
        >
          {loading ? "Preparing..." : "Prepare Claim"}
        </Button>
      </div>



        </form>
      </div>


      {/* Bottom Sheet Confirmation  */}
    {showConfirmModal && claimData && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">

    <div className="w-full bg-white rounded-t-2xl max-h-[95vh] flex flex-col animate-slide-up">

      <div className="p-4 pb-2">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1ebac1] text-center mt-3">
          Confirm Claim Submission
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-8">

        <Card className="border border-gray-200 rounded-lg mb-3">
          <CardContent className="space-y-2 text-sm sm:text-base">
            <h3 className="font-bold text-[#1ebac1] text-sm">Patient & Claim Details</h3>
            <p><strong>Patient:</strong> {claimData.patient.name} ({claimData.patient.id})</p>
            <p><strong>Claim Code:</strong> {claimData.claimCode}</p>
            <p><strong>NMC Number:</strong> {claimData.nmcNumber}</p>
            <p><strong>Comments:</strong> {claimData.comments || "-"}</p>
            <p><strong>Created At:</strong> {claimData.createdAt}</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-lg mb-3">
          <CardContent className="space-y-2 text-sm sm:text-base">
            <h3 className="font-bold text-[#1ebac1] text-sm">Invoice / Bill</h3>
            <p><strong>Hospital:</strong> {billData.hospital.name}, {billData.hospital.address}</p>
            <p><strong>Phone:</strong> {billData.hospital.phone} | <strong>PAN:</strong> {billData.hospital.pan}</p>
            <p><strong>Invoice #:</strong> {billData.invoice.number}</p>
            <p><strong>Date:</strong> {billData.invoice.date}</p>
            <p><strong>Generated By:</strong> {billData.invoice.generatedBy}</p>
            <p><strong>Generated At:</strong> {billData.invoice.generatedAt}</p>
          </CardContent>
        </Card>

        {billData.visits.map((visit, idx) => (
          <Card key={idx} className="border border-gray-200 rounded-lg mb-3">
            <CardContent className="space-y-2 text-sm sm:text-base">
              <h3 className="font-bold text-[#1ebac1] text-sm">Visit #{idx + 1}</h3>
              <p><strong>Service:</strong> {visit.TestName || visit.medicine || visit.Details}</p>
              <p><strong>Amount:</strong> Rs {visit.amount.toFixed(2)}</p>
              <p><strong>Date:</strong> {visit.transactionDate || visit.SaleDate}</p>
            </CardContent>
          </Card>
        ))}

        <div className="text-right font-bold text-lg mb-4">
          Total: Rs {claimData.totalAmount.toFixed(2)}
        </div>
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>

          <Button
            className="bg-[#1ebac1] text-white  hover:bg-[#1ebac1] w-full"
            onClick={() => finalizeClaim(claimData)}
          >
            Confirm & Submit
          </Button>
        </div>
      </div>

    </div>
  </div>

      )}

    </div> 
  );
};


  
export default StaffPrepareClaim;




