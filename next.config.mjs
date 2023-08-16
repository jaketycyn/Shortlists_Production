// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds. AZ
 */
import withPWA from "next-pwa";

async function loadConfig() {
  !process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

  const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
  };

  const withPWALoaded = withPWA(pwaConfig);

  /** @type {import("next").NextConfig} */
  const config = withPWALoaded({
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
  });

  return config;
}

export default loadConfig();
