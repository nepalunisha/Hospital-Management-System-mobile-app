import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Preferences } from "@capacitor/preferences";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import NepaliDate from "nepali-date-converter";
import "nepali-datepicker-reactjs/dist/index.css";

const mockPatients = [
  { id: "P1001", name: "Unisha Nepal" },
  { id: "P1002", name: "Ram Bahadur" },
  { id: "P1003", name: "Sita Tamang" },
  { id: "P1004", name: "David Magar" },
  { id: "P1005", name: "Sarina Shrestha" },
  { id: "P1006", name: "Dikshya Shrestha" },
  { id: "P1007", name: "Sanjana Bhandari" },
];

const StaffDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof mockPatients>([]);
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);
  const [startDate, setStartDate] = useState<string>("2080-01-01");
  const [endDate, setEndDate] = useState<string>("2080-01-01");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const { value } = await Preferences.get({ key: "staffLoggedIn" });
      if (value !== "true") {
        toast({
          title: "Access Denied",
          description: "Please log in to continue",
          variant: "destructive",
        });
        navigate("/staff-login", { replace: true });
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, [navigate, toast]);

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


  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = mockPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.id.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

   const selectPatient = (patient: typeof mockPatients[0]) => {
  setSelectedPatient(patient);
  setSearchQuery("");
  setSuggestions([]);
  toast({ title: "Patient Selected", description: patient.name });
  navigate("/staff-prepare-claim", {
    state: { patient, startDate, endDate },
  });
};

  const proceedToPrepareClaim = () => {
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a patient first.",
        variant: "destructive",
      });
      return;
    }
    navigate("/staff-prepare-claim", {
      state: { patient: selectedPatient, startDate, endDate },
    });
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-[#e0f0ff] flex flex-col items-center p-4">
      <div className="w-full max-w-sm flex items-center mt-6 gap-4">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer hover:text-[#1ebac1] transition-colors"
          onClick={() => navigate("/staff-home")}
        />
        <h1 className="text-xl font-bold text-[#1ebac1]">Prepare Insurance Claim</h1>
      </div>

      <div className="w-full max-w-md mt-6 flex flex-col gap-4">
        {!selectedPatient ? (
          <div className="relative w-full">
            <Input
              placeholder="Enter Patient ID or Name"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-12 p-4 text-sm border border-[#1ebac1] rounded-xl shadow focus:ring-1 focus:ring-[#1ebac1]"
            />
            {suggestions.length > 0 && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-xl mt-2 max-h-60 overflow-y-auto z-20 shadow-lg">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => selectPatient(p)}
                    className="p-3 text-sm cursor-pointer hover:bg-[#e0f0ff] transition-colors border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium">{p.name}</span>{" "}
                    <span className="text-gray-500">({p.id})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full p-4 border-2 border-[#1ebac1] rounded-xl shadow-md bg-white text-center">
            <p className="text-sm text-[#1ebac1]">
              <strong>ID:</strong> {selectedPatient.id}
            </p>
            <p className="text-lg font-bold text-[#1ebac1] mt-1">{selectedPatient.name}</p>
            <Button
              variant="outline"
              className="w-full mt-3 border-[#1ebac1] hover:bg-[#1ebac1] hover:text-white"
              onClick={() => setSelectedPatient(null)}
            >
              Change Patient
            </Button>
            
          </div>
        )}

        <div className="w-full flex flex-col">
          <p className="text-xs text-[#1ebac1] mb-1 font-semibold">Billing Start Date (BS)</p>
          <div className="relative">
            <NepaliDatePicker
            inputClassName="w-full h-12 text-base border border-[#1ebac1] rounded-xl shadow px-4 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1ebac1]"
            value={startDate}
            onChange={(value: string) => setStartDate(value)}
            options={{ calenderLocale: "ne", valueLocale: "en" }}
          />

  
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1ebac1] pointer-events-none" />
          </div>
        </div>
        <div className="w-full flex flex-col">
          <p className="text-xs text-[#1ebac1] mb-1 font-semibold">Billing End Date (BS)</p>
          <div className="relative">
            <NepaliDatePicker
              inputClassName="w-full h-12 text-base border border-[#1ebac1] rounded-xl shadow px-4 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1ebac1]"
              value={endDate}
              onChange={(value: string) => setEndDate(value)}
              options={{ calenderLocale: "ne", valueLocale: "en" }}
            />

            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1ebac1] pointer-events-none" />
          </div>
        </div>

        <Button
          className="w-full bg-[#1ebac1] hover:bg-[#1ebac1]  py-7 text-white text-lg font-bold rounded-xl shadow-lg hover:[#1ebac1] hover:scale-105 transition-all mt-6"
          onClick={proceedToPrepareClaim}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default StaffDashboard;
