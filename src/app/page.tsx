import { FullSite } from "@/components/FullSite";
import { MaintenancePage } from "@/components/MaintenancePage";

// Local/preview: defina SHOW_FULL_SITE=true em .env.local para ver o site completo.
// Sem a flag (produção), a página de manutenção é exibida.
export default function Home() {
  return process.env.SHOW_FULL_SITE === "true" ? <FullSite /> : <MaintenancePage />;
}
