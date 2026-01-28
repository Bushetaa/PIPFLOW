import { motion } from "framer-motion";

const pairs = ["EUR/USD", "GBP/JPY", "USD/JPY", "AUD/USD", "XAU/USD", "BTC/USD"];
const particlePositions = [
  { x: "10%", y: "20%" }, { x: "80%", y: "30%" }, { x: "25%", y: "70%" },
  { x: "60%", y: "15%" }, { x: "40%", y: "50%" }, { x: "75%", y: "80%" },
  { x: "15%", y: "85%" }, { x: "90%", y: "60%" }, { x: "35%", y: "25%" }, { x: "55%", y: "75%" }
];

export function Background3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="bg-market-lines" />
      <div className="absolute inset-0">
        {pairs.map((_, i) => (
          <motion.div
            key={`pair-shape-${i}`}
            className="market-pair"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 18}%`,
            }}
            initial={{ opacity: 0, y: 10, rotateX: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [10, -20, 10], rotateX: [0, 8, 0] }}
            transition={{ duration: 12 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="market-particle"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0.05, scale: 0.9 }}
            animate={{ opacity: [0.05, 0.25, 0.05], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}
