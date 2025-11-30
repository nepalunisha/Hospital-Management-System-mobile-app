import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Preferences } from "@capacitor/preferences";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
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
  const [startDate, setStartDate] = useState("2081-01-01");
  const [endDate, setEndDate] = useState("2081-01-01");
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value) return setSuggestions([]);
    setSuggestions(
      mockPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.id.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const selectPatient = (p: typeof mockPatients[0]) => {
    setSelectedPatient(p);
    setSearchQuery("");
    setSuggestions([]);
    toast({ title: "Patient Selected", description: p.name });
  };

  const proceedToPrepareClaim = () => {
    if (selectedPatient)
      navigate("/staff-prepare-claim", { state: { patient: selectedPatient, startDate, endDate } });
    else toast({ title: "Error", description: "Please select a patient first.", variant: "destructive" });
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-[#e0f0ff] flex flex-col items-center p-4">

      {/* Back */}
      <div className="w-full max-w-sm flex items-center mt-6 gap-6">
        <ArrowLeft
          className="h-6 w-6 text-[#1ebac1] cursor-pointer hover:text-[#003b73] transition-colors"
          onClick={() => navigate("/staff-home")}
        />
        <h1 className="text-xl font-bold text-[#1ebac1] ml-2">Prepare Insurance Claim</h1>
      </div>

      {/* Patient Selection */}
      <div className="w-full min-h-md mt-6 flex flex-col items-center gap-2">
        {!selectedPatient ? (
          <div className="relative w-full">
            <Input
              placeholder="Enter Patient ID or Name"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-12 p-4 text-sm border border-[#1ebac1] rounded-xl shadow-xlfocus:ring-1 focus:ring-[#1ebac1]"
            />
            {suggestions.length > 0 && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-xl mt-2 max-h-40 overflow-y-auto z-20 shadow-md">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => selectPatient(p)}
                    className="p-2 text-sm cursor-pointer hover:bg-[#e0f0ff] rounded transition-colors"
                  >
                    {p.name} ({p.id})
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full p-3 border border-[#1ebac1] rounded-xl shadow-md bg-white space-y-1">
            <p className="text-sm text-[#1ebac1] text-center"><strong>ID:</strong> {selectedPatient.id}</p>
            <p className="text-sm text-[#1ebac1] text-center"><strong>Name:</strong> {selectedPatient.name}</p>
            <Button
              variant="outline"
              className="w-full py-2 text-sm border-[#1ebac1] hover:bg-[#1ebac1] hover:text-white transition-all"
              onClick={() => setSelectedPatient(null)}
            >
              Change Patient
            </Button>
          </div>
        )}

         {/* Billing Dates */}
        <div className="w-full max-w-md  gap-2">


          {/* Start Date */}
          <div className="flex flex-col mt-4">
            <p className="text-sm text-[#1ebac1] mb-1 font-semibold "> Billing Start Date (BS)</p>
            <div className="relative w-full overflow-visible">
              
              <NepaliDatePicker
                inputClassName="w-full h-12 text-sm border border-[#1ebac1] rounded-xl shadow px-2 text-left bg-white cursor-pointer"
                value={startDate}
                onChange={(value: string) => setStartDate(value)}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1ebac1] pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col mt-4">
            <p className="text-sm text-[#1ebac1] mb-1 font-semibold ">Billing End Date (BS)</p>
            <div className="relative w-full overflow-novisible">
              <NepaliDatePicker
                inputClassName="w-full h-12 text-sm border border-[#1ebac1] rounded-xl shadow px-2 text-left bg-white cursor-pointer"
                value={endDate}
                onChange={(value: string) => setEndDate(value)}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
                
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1ebac1] pointer-events-none" />
            </div>
          </div>
        </div>



        {/* Prepare Claim */}
        <div className="w-full max-w-md mt-6">
          <Button
            className="w-full bg-[#1ebac1] py-3 text-white text-base font-semibold rounded-xl shadow-md hover:[#1ebac1] hover:scale-105  transition-transform"
            onClick={proceedToPrepareClaim}
          >
            Prepare Claim
          </Button>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;
