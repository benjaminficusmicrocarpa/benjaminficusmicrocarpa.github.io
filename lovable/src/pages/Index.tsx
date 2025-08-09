import LLMInfographic from "@/components/infographic/LLMInfographic";
import type React from "react";

const Index = () => {
  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const root = document.documentElement;
    root.style.setProperty("--pointer-x", `${e.clientX}px`);
    root.style.setProperty("--pointer-y", `${e.clientY}px`);
  };

  return (
    <div onMouseMove={handleMouseMove} className="min-h-screen bg-background">
      <section className="ambient-spotlight">
        <div className="container py-12">
          <LLMInfographic />
        </div>
      </section>
    </div>
  );
};

export default Index;
