import { Brain, Database, Cog, ThumbsUp, Gauge, MessageSquare, Shield, Sparkles, Zap, Box, Layers, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type React from "react";

const InfoCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon,
  children: React.ReactNode,
}) => (
  <article className="group relative rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
    <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
      <div className="pointer-events-none bg-gradient-primary opacity-[0.06] h-full w-full rounded-lg" />
    </div>
    <header className="relative z-10 mb-3 flex items-center gap-3">
      <div className="rounded-md bg-secondary p-2 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </header>
    <div className="relative z-10 text-sm leading-relaxed text-muted-foreground">
      {children}
    </div>
  </article>
);

const LLMInfographic = () => {
  return (
    <div className="relative">
      <header className="mb-10 text-center">
        <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden /> Visual guide
        </p>
        <h1 className="text-gradient-primary mx-auto max-w-3xl bg-clip-text text-4xl font-extrabold tracking-tight sm:text-5xl">
          LLM AI Infographic: How Large Language Models Work
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          A concise, visual overview of LLM AI—training, inference, strengths, limitations, and practical prompting tips.
        </p>
      </header>

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* What is an LLM */}
        <section className="lg:col-span-5">
          <InfoCard title="What is an LLM?" icon={Brain}>
            <p>
              A Large Language Model (LLM) is a neural network trained on vast text corpora to predict the next token (word/subword). With enough parameters and data, it learns patterns that enable reasoning, generation, and summarization.
            </p>
            <ul className="mt-3 grid list-inside list-disc gap-1">
              <li>Understands and generates human-like text</li>
              <li>Adapts via fine-tuning and instruction following</li>
              <li>Works best with clear context and goals</li>
            </ul>
          </InfoCard>
        </section>

        {/* Training pipeline */}
        <section className="lg:col-span-7">
          <InfoCard title="Training pipeline" icon={Database}>
            <ol className="grid gap-3 sm:grid-cols-2">
              <li className="rounded-md border bg-card p-3">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <Layers className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-medium">Data curation</span>
                </div>
                <p className="text-muted-foreground">High-quality, diverse text is collected and filtered.</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <Box className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-medium">Tokenization</span>
                </div>
                <p className="text-muted-foreground">Text is split into tokens the model can process.</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <Cog className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-medium">Pretraining</span>
                </div>
                <p className="text-muted-foreground">Model learns to predict next tokens across billions of examples.</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <ThumbsUp className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-medium">Alignment (RLHF)</span>
                </div>
                <p className="text-muted-foreground">Human feedback steers outputs toward helpfulness and safety.</p>
              </li>
              <li className="rounded-md border bg-card p-3 sm:col-span-2">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <Gauge className="h-4 w-4 text-primary" aria-hidden />
                  <span className="font-medium">Evaluation</span>
                </div>
                <p className="text-muted-foreground">Benchmarks and red-team testing validate quality and reduce risks.</p>
              </li>
            </ol>
          </InfoCard>
        </section>

        {/* Inference flow */}
        <section className="lg:col-span-7">
          <InfoCard title="Inference flow" icon={MessageSquare}>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Prompt", Icon: FileText, desc: "Provide clear goals and context." },
                { label: "Tokenize", Icon: Box, desc: "Convert text into model tokens." },
                { label: "Context window", Icon: Layers, desc: "Only recent tokens fit in memory." },
                { label: "Decode", Icon: Zap, desc: "Sample next tokens (e.g., temperature, top-p)." },
                { label: "Output", Icon: Sparkles, desc: "Model returns generated text." },
                { label: "Feedback", Icon: ThumbsUp, desc: "Refine prompts or apply tools." },
              ].map((step) => (
                <div key={step.label} className="rounded-md border bg-card p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <step.Icon className="h-4 w-4 text-primary" aria-hidden />
                    <span className="font-medium text-foreground">{step.label}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </InfoCard>
        </section>

        {/* Strengths & limits */}
        <section className="lg:col-span-5">
          <InfoCard title="Strengths & limitations" icon={Gauge}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-foreground">Strengths</h4>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Fast content generation</li>
                  <li>Summarization & translation</li>
                  <li>Structured extraction</li>
                  <li>Code assistance</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-foreground">Limitations</h4>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>May hallucinate facts</li>
                  <li>Limited context window</li>
                  <li>Sensitive to prompt wording</li>
                  <li>Data freshness constraints</li>
                </ul>
              </div>
            </div>
          </InfoCard>
        </section>

        {/* Prompting tips */}
        <section className="lg:col-span-7">
          <InfoCard title="Prompting tips" icon={FileText}>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li className="rounded-md border bg-card p-3">
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Be explicit:</span> Define role, task, format, and constraints.</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Provide context:</span> Include examples and references.</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Iterate:</span> Use follow-ups to refine outputs.</p>
              </li>
              <li className="rounded-md border bg-card p-3">
                <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Constrain outputs:</span> Ask for JSON, bullets, or tables.</p>
              </li>
            </ul>
          </InfoCard>
        </section>

        {/* Use cases */}
        <section className="lg:col-span-5">
          <InfoCard title="Common use cases" icon={Sparkles}>
            <div className="flex flex-wrap gap-2">
              {["Content", "Customer Support", "Analytics", "Coding", "Education", "Research", "Product", "Marketing"].map((tag) => (
                <span key={tag} className="rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </InfoCard>
        </section>

        {/* Safety */}
        <section className="lg:col-span-7">
          <InfoCard title="Safety & privacy" icon={Shield}>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li className="rounded-md border bg-card p-3 text-sm text-muted-foreground">
                Avoid sharing secrets or personal data in prompts.
              </li>
              <li className="rounded-md border bg-card p-3 text-sm text-muted-foreground">
                Verify critical facts; cite sources when possible.
              </li>
              <li className="rounded-md border bg-card p-3 text-sm text-muted-foreground">
                Apply guardrails: moderation, policy checks, allowlists.
              </li>
              <li className="rounded-md border bg-card p-3 text-sm text-muted-foreground">
                Log and review outputs for quality and bias.
              </li>
            </ul>
          </InfoCard>
        </section>
      </main>
      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Built with semantic tokens, responsive design, and accessible markup.
      </footer>
    </div>
  );
};

export default LLMInfographic;
