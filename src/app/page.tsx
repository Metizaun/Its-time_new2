import { FullSite } from "@/components/FullSite";
import { MaintenancePage } from "@/components/MaintenancePage";

// SHOW_FULL_SITE é lido na hora do build (esta rota é estática), então é uma chave de build, não de runtime.
// Local/preview: defina SHOW_FULL_SITE=true em .env.local para ver o site completo.
// Produção: sem a flag, a página de manutenção é exibida; para publicar o site completo, faça o build da imagem
// com --build-arg SHOW_FULL_SITE=true (os arquivos .env* não entram na imagem, ver .dockerignore).
export default function Home() {
  return process.env.SHOW_FULL_SITE === "true" ? <FullSite /> : <MaintenancePage />;
}
