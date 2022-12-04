import dynamic from "next/dynamic";

const ProfileComponent = dynamic(
  async () => await import("../components/layouts/profile/ProfilePageLayout"),
  {
    ssr: false,
  }
);

function ProfilePage() {
  return (
    <div>
      <ProfileComponent />
    </div>
  );
}

export default ProfilePage;
