
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
const StdSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
  
    try {
      const response = await fetch("http://10.200.17.94:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error || "Signup failed. Please try again.");
        return;
      }
  
      console.log("Signup success:", data);
      alert("Signup successful! You can now log in.");
      navigate("/login");

  
      // Clear form fields after successful signup
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);
  
      // Optionally redirect
      // navigate('/login'); if you're using react-router-dom v6
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-indigo-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join SpeakSpace and improve your communication skills
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full"
                    placeholder="••••••••"
                    required
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 w-full"
                    placeholder="••••••••"
                    required
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Checkbox 
                id="agree-terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                required
              />
              <Label 
                htmlFor="agree-terms" 
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </Label>
            </div>
            
            <div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!agreeTerms}
              >
                Sign up
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StdSignup;
