// src/instruction.tsx
type Props = {
  country: string;
};

export default function Instruction({ country }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-semibold">
        Welcome to the {country} Evaluation
      </h2>
      <p className="text-center max-w-xl">
        Here you will evaluate captions based on Cultural Appropriateness,
        Visual Detail, and Hallucination.
        <br />
        Click Next to begin.
      </p>
      <button className="mt-4 px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600">
        Next
      </button>
    </div>
  );
}
