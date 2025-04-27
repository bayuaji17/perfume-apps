import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const result = await signOut({ redirect: false });
    if (result) {
      toast.success("Sign Out Success");
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } else {
      toast.error("Sign Out Failed");
    }
  };

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
