import dynamic from "next/dynamic";

const LoginForm = dynamic(async () => await import("../components/Loginform"), {
  ssr: false,
});

function RegisterPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default RegisterPage;
