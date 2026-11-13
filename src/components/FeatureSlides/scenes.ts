// Every animated scene behind one import. When each slide imported its own scene, the bundler copied
// framer-motion into five separate ~147 KB chunks and the home page downloaded all of them.
export { CashFlow } from "./CashFlow";
export { ChatJourney } from "./ChatJourney";
export { CustomerJourney } from "./CustomerJourney";
export { HandoffMap } from "./HandoffMap";
export { OperationDay } from "./OperationDay";
export { PerformancePanel } from "./PerformancePanel";
export { RevenueRecovery } from "./RevenueRecovery";
