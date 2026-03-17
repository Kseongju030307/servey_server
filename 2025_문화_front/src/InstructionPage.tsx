import React from "react";
import "./styles.css";

type Props = {
  onStart: () => void;
};

export default function InstructionPage({ onStart }: Props) {
  return (
    <div className="container">
      <h1 className="main-title">Evaluation Instructions</h1>

      <div className="content">
        {/* Cultural Appropriateness */}
        <div className="instruction-block">
          <h2 className="sub-title">Cultural Appropriateness</h2>
          <p className="paragraph">
            Evaluate how accurately and with sufficient detail the caption describes the cultural 
            information of the artifact, including its name, country, and cultural context.

          </p>
          <ul className="list">
            <li>
              <strong>(1)</strong> – Inaccurately Descriptive
            </li>
            <li>
              <strong>(2)</strong> – Not Descriptive
            </li>
            <li>
              <strong>(3)</strong> – Somewhat Descriptive
            </li>
            <li>
              <strong>(4)</strong> – Mostly Descriptive
            </li>
            <li>
              <strong>(5)</strong> – Highly Descriptive
            </li>
          </ul>
        </div>

        {/* Visual Detail */}
        <div className="instruction-block">
          <h2 className="sub-title">Visual Detail</h2>
          <p className="paragraph">
            Evaluate how accurately and specifically the caption describes the visual elements of the 
            artifact, including its shape, color, and other observable features.

          </p>
          <ul className="list">
            <li>
              <strong>(1)</strong> – Inaccurately Descriptive
            </li>
            <li>
              <strong>(2)</strong> – Not Descriptive
            </li>
            <li>
              <strong>(3)</strong> – Somewhat Descriptive
            </li>
            <li>
              <strong>(4)</strong> – Mostly Descriptive
            </li>
            <li>
              <strong>(5)</strong> – Highly Descriptive
            </li>
          </ul>
        </div>

        {/* Hallucination */}
        <div className="instruction-block">
          <h2 className="sub-title">Hallucination</h2>
          <p className="paragraph">
            Evaluate how much information that is not visually verifiable is included in the caption, such 
            as knowledge and cultural conventions.


          </p>
          <ul className="list">
            <li>
              <strong>(1)</strong> – Not at all
            </li>
            <li>
              <strong>(2)</strong> – Slightly
            </li>
            <li>
              <strong>(3)</strong> – Somewhat
            </li>
            <li>
              <strong>(4)</strong> – Mostly
            </li>
            <li>
              <strong>(5)</strong> – Completely
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="button-wrapper">
          <button className="next-button" onClick={onStart}>
            Start Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}
