export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: startCronJobs } = await import("./app/lib/cron");
    startCronJobs();
  }
}
