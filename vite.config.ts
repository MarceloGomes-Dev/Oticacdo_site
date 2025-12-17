import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  /**
   * Use "./" se for subir em subpasta (GitHub Pages, FTP)
   * Use "/" se for domínio raiz (www.oticacdo.com.br)
   */
  base: "./"
});
