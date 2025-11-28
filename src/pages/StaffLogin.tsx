import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Preferences } from "@capacitor/preferences";
import Logo from "../components/ui/Logo.png";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const staffEmails = [
    "staff1@nepinsurance.com",
    "staff2@nepinsurance.com",
    "staff3@nepinsurance.com",
    "staff4@nepinsurance.com",
  ];

  const [filteredEmails, setFilteredEmails] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadLogin = async () => {
      const { value } = await Preferences.get({ key: "staffLogin" });
      if (value) {
        const { email, password } = JSON.parse(value);
        setEmail(email);
        setPassword(password);
        setRememberMe(true);
      }
    };
    loadLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password) {
      if (rememberMe) {
        await Preferences.set({
          key: "staffLogin",
          value: JSON.stringify({ email, password }),
        });
      } else {
        await Preferences.remove({ key: "staffLogin" });
      }

      await Preferences.set({ key: "staffLoggedIn", value: "true" });

      toast({
        title: "Login Successful",
        description: "Welcome to Staff Portal",
      });
      navigate("/staff-Home");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Password reset link sent to ${resetEmail}`,
    });

    setShowForgotPassword(false);
    setResetEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8f9ff]">

      {/* Header */}
        <div className="w-full bg-[#1ebac1] pt-12 pb-10 flex flex-col items-center shadow-md">
        <img
          src={Logo}
          alt="logo"
          className="w-40 h-40 rounded-full bg-white p-3 shadow-xl"
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-4 flex items-center gap-2 text-white font-medium"
        >
          <ArrowLeft className="h-5 w-5" /> 
        </button>

        {/* Title */}
        <div className="flex flex-col items-center mt-6">
          <h1 className="text-3xl font-bold text-white">Staff Login</h1>
          <p className="text-white/90 text-sm mt-1">
            Enter your credentials to continue
          </p>
        </div>
      </div>

      {/*  Form */}
      <div className="flex-1 px-6 mt-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto flex flex-col gap-5"
        >

          {/* Email */}
          <div className="relative">
            <div className="flex items-center gap-3 p-3 border border-[#1ebac1] rounded-xl bg-white shadow-sm">
              <Mail className="h-5 w-5 text-[#1ebac1]" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="username"
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);

                  if (value.length > 0) {
                    const matches = staffEmails.filter((item) =>
                      item.toLowerCase().includes(value.toLowerCase())
                    );
                    setFilteredEmails(matches);
                    setShowSuggestions(matches.length > 0);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                className="flex-1 border-0 text-sm focus-visible:ring-0"
              />
            </div>

            {showSuggestions && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-md z-20">
                {filteredEmails.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setEmail(item);
                      setShowSuggestions(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 p-3 border border-[#1ebac1] rounded-xl bg-white shadow-sm">
            <Lock className="h-5 w-5 text-[#1ebac1]" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="flex-1 border-0 text-sm focus-visible:ring-0"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-[#1ebac1]" />
              ) : (
                <Eye className="h-5 w-5 text-[#1ebac1]" />
              )}
            </button>
          </div>

          {/* Remember Me  */}
          <div className="flex justify-between text-sm px-1">
            <label className="flex items-center accent-[#1ebac1] gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 "
              />
              <span className="text-[#1ebac1]">Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-[#1ebac1] font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1ebac1] text-white text-lg shadow-md hover:scale-[1.02] transition"
          >
            Log In
          </Button>
        </form>
      </div>

      {/*  Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1ebac1]">
                Reset Password
              </h2>
              <button onClick={() => setShowForgotPassword(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 text-sm">
              Enter your email to receive a reset link.
            </p>

            <div className="flex items-center gap-3 p-3 border border-[#1ebac1] rounded-xl">
              <Mail className="h-5 w-5 text-[#1ebac1]" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="flex-1 border-0 text-sm focus-visible:ring-0"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                className="flex-1 py-3 bg-[#1ebac1] text-white rounded-xl"
                onClick={handleForgotPassword}
              >
                Send Reset Link
              </Button>
              <Button
                className="flex-1 py-3 border rounded-xl"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffLogin;
