import NotFound from "@/app/components/Errors/Not Found/notFound";
import styles from "./page.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.not_found}>
      <NotFound
        errorMessage="This draft seems to have gone quiet..."
        buttonText="Back to Drafts"
        href="/drafts"
      />
    </div>
  );
}
