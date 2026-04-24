import Pagination from "@/app/components/Pagination/pagination";
import styles from "./page.module.css";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { cookies } from "next/headers";
import UsernameClient from "./client";
import NotFound from "@/app/components/Errors/Not Found/notFound";

interface PageProps {
  params: Promise<{ username: string }>;
}

// Checks if the username exists, if they have publihed ambiance, and returns it with correct uppercase/lowercases if it does
async function getUsername(username: string): Promise<string | undefined> {
  const isDev = process.env.NODE_ENV === "development";
  const supabase = isDev ? createAdminClient() : createClient(cookies());
  const { data, error } = await supabase
    .from("users")
    .select("username, id")
    .ilike("username", username)
    .single();
  console.log("user data:");
  console.log(data);
  if (error || !data?.id) {
    return undefined;
  }
  const { data: ambData, error: ambError } = await supabase
    .from("ambiances")
    .select("id")
    .eq("user_id", data.id)
    .eq("status", "published")
    .limit(1);
  console.log("ambiance data:");
  console.log(ambData);
  if (ambError || !ambData?.length) {
    return undefined;
  }
  return data.username;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  console.log("welcome to the username page");
  console.log(username.slice(0,3));
  if (username.slice(0,3) === "%40") {
    // Checks if username exists and creates the page if it does
    const correctUsername = await getUsername(username.slice(3));
    if (correctUsername) {
      return <UsernameClient username={correctUsername} />;
    }
  }
  return (
    <div className={styles.not_found}>
      <NotFound errorMessage="Page not found" buttonText="Go Back" href="/" />
    </div>
  );
}
