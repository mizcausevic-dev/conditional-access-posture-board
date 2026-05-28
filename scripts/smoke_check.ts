import app from "../src/app.js";

const paths = [
  "/",
  "/policy-lane",
  "/control-gaps",
  "/exception-posture",
  "/verification",
  "/docs",
  "/api/dashboard/summary",
  "/api/policy-lane",
  "/api/control-gaps",
  "/api/exception-posture",
  "/api/verification",
  "/api/sample"
];

const server = app.listen(0, "127.0.0.1", async () => {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to resolve local server port");
  }

  for (const route of paths) {
    const response = await fetch(`http://127.0.0.1:${address.port}${route}`);
    if (!response.ok) {
      throw new Error(`Smoke check failed for ${route}: ${response.status}`);
    }
  }

  console.log("smoke check passed");
  server.close();
});
