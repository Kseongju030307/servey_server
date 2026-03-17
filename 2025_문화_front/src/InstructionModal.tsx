import "./styles.css";

type Props = {
  onClose: () => void;
};

export default function InstructionModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>📘 Evaluation Criteria</h3>

        <p>
          <strong>Cultural Appropriateness</strong>
          <br />
          Evaluate how accurately and with sufficient detail the caption describes the cultural 
          information of the artifact, including its name, country, and cultural context.

        </p>

        <ul>
          <li>
            (1) – Inaccurately Descriptive
          </li>
          <li>
            (2) – Not Descriptive
          </li>
          <li>
            (3) – Somewhat Descriptive
          </li>
          <li>
            (4) – Mostly Descriptive
          </li>
          <li>
            (5) – Highly Descriptive 
          </li>
        </ul>

        <p>
          <strong>Visual Detail</strong>
          <br />
          Evaluate how accurately and specifically the caption describes the visual elements of the 
          artifact, including its shape, color, and other observable features.

        </p>

        <ul>
          <li>(1) – Inaccurately Descriptive</li>
          <li>
            (2) – Not Descriptive
          </li>
          <li>(3) – Somewhat Descriptive</li>
          <li>
            (4) – Mostly Descriptive
          </li>
          <li>
            (5) – Highly Descriptive 
          </li>
        </ul>

        <p>
          <strong>Hallucination</strong>
          <br />
          Evaluate how much information that is not visually verifiable is included in the caption, such 
          as knowledge and cultural conventions.


        </p>

        <ul>
          <li>(1) – Not at all</li>
          <li>(2) – Slightly</li>
          <li>(3) – Somewhat</li>
          <li>(4) – Mostly</li>
          <li>(5) – Completely</li>
        </ul>

        <button className="close-button" onClick={onClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
}
