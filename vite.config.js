import vitePluginString from "vite-plugin-string";

export default {
  plugins: [vitePluginString()],
  base: process.env.NODE_ENV === "production" ? "/mySeven/" : "",
};
