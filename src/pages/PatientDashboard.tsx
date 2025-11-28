import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("patientLoggedIn") === "true";
    if (!isLoggedIn) {
      toast({
        title: "Access Denied",
        description: "Please log in to continue",
        variant: "destructive",
      });
      navigate("/patient-login", { replace: true });
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("patientLoggedIn");
    toast({
      title: "Logged out",
      description: "See you soon, Unisha!",
    });
    navigate("/patient-login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-start p-4 pt-10">
      <div className="w-full max-w-md flex justify-end mb-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2 border-[#003B73] text-[#003B73]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card className="w-full max-w-md border-2 border-gray-300 shadow-lg rounded-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-3xl">Welcome</div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#003B73]">
            Hello, Unisha!
          </h2>
          <p className="text-gray-600 text-lg">
            You are successfully logged in to your patient portal.
          </p>

          <div className="pt-6 space-y-4">
            <Button className="w-full h-14 text-lg font-semibold bg-[#003B73] 
             hover:bg-[#003B73]">
              View My Claims
            </Button>
            <Button variant="outline" className="w-full h-14 text-lg font-semibold border-[#003B73] text-[#003B73]">
              Upload Documents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;