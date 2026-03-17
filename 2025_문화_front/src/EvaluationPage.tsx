import React, { useState } from "react";
import "./styles.css";
import InstructionModal from "./InstructionModal";

export type CaptionInfo = {
  level: "level2" | "level3" | "level4";
  caption: string;
};

export type Evaluation = {
  Cultural_Appropriateness: number | null;
  Visual_Detail: number | null;
  Hallucination: number | null;
};

type Props = {
  imageUrl: string;
  captions: CaptionInfo[];
  allScores: Record<string, Evaluation>;
  setAllScores: React.Dispatch<React.SetStateAction<Record<string, Evaluation>>>;
  onSubmit: (evaluations: Record<string, any>) => void;
  category: string;
  item: string;
  nation: string;
  fullCaption: string;
};

export default function EvaluationPage({
  imageUrl,
  captions,
  allScores,
  setAllScores,
  onSubmit,
  category,
  item,
  nation,
  fullCaption,
}: Props) {
  const [showInstruction, setShowInstruction] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleChange = (
    level: string,
    field: keyof Evaluation,
    value: number
  ) => {
    setAllScores((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const incomplete = Object.values(allScores).some(
      (s) =>
        s.Cultural_Appropriateness === null ||
        s.Visual_Detail === null ||
        s.Hallucination === null
    );

    if (incomplete) {
      alert("Please complete all evaluations.");
      return;
    }

    const formatted: Record<string, any> = Object.fromEntries(
      captions.map((c) => [
        c.level,
        {
          caption: c.caption,
          ...allScores[c.level],
        },
      ])
    );

    formatted["level1"] = {
      caption:
        "A modern, brightly colored Buddhist monk's robe demonstrates a contemporary adaptation of traditional Korean ritual garments.",
    };

    formatted["caption"] = { caption: fullCaption };
    formatted["category"] = category;
    formatted["item"] = item;
    formatted["nation"] = nation;

    onSubmit(formatted);
  };

  return (
    <div className="container">
      {/* 오른쪽 상단 Instruction 버튼 */}
      <div className="instruction-button-global-wrapper">
        <button
          className="instruction-button-global"
          onClick={() => setShowInstruction(true)}
        >
          📘 Instruction
        </button>
      </div>

      {/* 이미지와 제목 겹치기 */}
      <div className="image-wrapper">
        <div className="image-title">{item}</div>
        <img
          src={imageUrl}
          alt="evaluation"
          className="evaluation-image"
          onClick={() => setShowImageModal(true)}
          style={{ cursor: "zoom-in" }}
        />
      </div>

      {/* 캡션 및 평가 폼 */}
      {captions.map((c, index) => (
        <div key={c.level} className="caption-block">
          {index !== 0 && <hr className="caption-divider" />}
          <p className="caption">{c.caption}</p>

          <table className="rating-table">
            <thead>
              <tr>
                <th></th>
                {[1, 2, 3, 4, 5].map((n) => (
                  <th key={n}>{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Cultural_Appropriateness", "Visual_Detail", "Hallucination"].map(
                (field) => (
                  <tr key={field}>
                    <td>{field.replace(/_/g, " ")}</td>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <td key={value}>
                        <input
                          type="radio"
                          name={`${field}-${c.level}`}
                          value={value}
                          checked={
                            allScores[c.level][field as keyof Evaluation] === value
                          }
                          onChange={() =>
                            handleChange(c.level, field as keyof Evaluation, value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ))}

      {/* 하단 버튼 */}
      <div className="button-wrapper spaced-buttons">
        <button
          className="next-button secondary"
          onClick={() => window.location.reload()}
        >
          Exit
        </button>
        <button className="next-button" onClick={handleSubmit}>
          Next Survey
        </button>
      </div>

      {/* Instruction 모달 */}
      {showInstruction && (
  <div
    className="instruction-modal-overlay"
    onClick={() => setShowInstruction(false)}
  >
    <div
      className="instruction-modal-content mac-style"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 닫기 버튼 (왼쪽 위 동그란 버튼) */}
      <div className="modal-header">
        <button
          className="mac-close-button"
          onClick={() => setShowInstruction(false)}
        />
      </div>

      {/* 모달 내용 */}
      <InstructionModal onClose={() => setShowInstruction(false)} />
    </div>
  </div>
)}

      {/* 이미지 확대 모달 */}
      {showImageModal && (
        <div
          className="image-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imageUrl} alt="zoomed" className="modal-image" />
            <button
              className="close-button"
              onClick={() => setShowImageModal(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
