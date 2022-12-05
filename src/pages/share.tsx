import dynamic from "next/dynamic";

const ShareForm = dynamic(async () => await import("../components/Shareform"), {
  ssr: false,
});

function ShareFormPage() {
  return (
    <div>
      <ShareForm />
    </div>
  );
}

export default ShareFormPage;
