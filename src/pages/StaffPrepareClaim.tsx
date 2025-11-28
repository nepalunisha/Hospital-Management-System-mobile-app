import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText } from "lucide-react";
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

const StaffPrepareClaim : React.FC = () => {
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


  const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

  useEffect(() => {
    const checkLogin = async () => {
      if (!patient) {
        toast({ title: "Access Denied", variant: "destructive" });
        navigate("/staff-dashboard");
      } else {
        setClaimCode("CLM" + Date.now());
        setAccessGranted(true);
      }
    };
    checkLogin();
  }, [navigate, patient, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
      setFileName(file.name);
    }
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nmcNumber.trim()) {
      toast({ title: "Error", description: "Please enter NMC Number", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {

    let base64File = "";
    if (prescriptionFile) {
      base64File = await fileToBase64(prescriptionFile);
    }
        const totalAmount = billData.visits.reduce((a, v) => a + v.amount, 0);
   
      const newClaim = {
        patient,
        claimCode,
        createdAt: new Date().toLocaleString(),
        prescriptionFileName: prescriptionFile?.name || "",
        prescriptionFileBase64: base64File,
        responseStatus: "Pending",
        outcome: "-",
        nmcNumber,
        comments,
        totalAmount,
      };

      await addClaim(newClaim);

      toast({ title: "Success", description: `Claim ${claimCode} submitted successfully!` });

      setNmcNumber("");
      setComments("");
      setFileName("No file chosen");
      setPrescriptionFile(null);

      navigate("/staff-home"); 
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit claim", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!accessGranted) return <p className="text-center mt-20">Checking access...</p>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-10 px-4">
      <div className="fixed top-6 left-4 z-50">
        <button onClick={() => navigate("/staff-dashboard")} className="flex items-center gap-2 text-[#1ebac1] font-semibold text-base">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-20 max-w-2xl w-full mx-auto flex flex-col space-y-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-[#00AEEF]">
          <p className="text-sm text-gray-600">Submitting claim for:</p>
          <p className="text-xl font-bold text-[#1ebac1] mt-1">{patient?.name} ({patient?.id})</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700">Claim Code</label>
            <Input value={claimCode} readOnly className="bg-gray-100 text-lg font-mono" />
          </div>

          <div>
            <label className="text-sm text-gray-700">NMC Number <span className="text-red-500">*</span></label>
            <Input placeholder="Enter NMC Number" value={nmcNumber} onChange={(e) => setNmcNumber(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm">Additional Comments</label>
            <Textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3} className="resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium"><FileText className="inline h-4 w-4 mr-1" />Doctor's Prescription</label>
            <div className="border-2 border-dashed p-5 mt-2 rounded-xl text-center">
              <Upload className="h-8 w-8 text-[#1ebac1] mx-auto" />
              <label className="cursor-pointer mt-2 inline-block">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <span className="underline text-[#1ebac1]">Choose File</span>
              </label>
              <p className="text-xs mt-1">{fileName}</p>
            </div>
          </div>

        {/* Bill Preview */}
          {["OPD", "Pharmacy", "Lab", "Diagnosis"].map((section) => (
            <Card key={section} className="mt-6 bg-transparent border border-gray-200">
              <CardContent>
                <h3 className="font-bold text-[#1ebac1] mb-2 text-xs">
                  {section} Invoice / Bill
                </h3>

                <div className="flex flex-col items-center text-center space-y-1 mb-3">
                  <img
                    src={Logo}
                    alt="logo"
                    className="w-8 h-8 object-contain"
                  />
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

          <Button type="submit" disabled={loading} className="w-full bg-[#1ebac1] hover:[#1ebac1] text-white h-14 text-lg mt-5">
            {loading ? "Submitting..." : "Submit Claim"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StaffPrepareClaim;
