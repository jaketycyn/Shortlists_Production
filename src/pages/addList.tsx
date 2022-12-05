import dynamic from "next/dynamic";

const AddListForm = dynamic(async () => await import("../components/AddList"), {
  ssr: false,
});

function AddListPage() {
  return (
    <div>
      <AddListForm />
    </div>
  );
}

export default AddListPage;
