import RegisterUser from "@/components/RegisterUser";


export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-light">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-darkBlue mb-4">Register</h2>
        <RegisterUser />
      </div>
    </div>
  );
}
