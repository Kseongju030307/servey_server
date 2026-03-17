import { useState } from "react";
import "./styles.css";

type Props = {
  userInfo: {
    gender: string;
    email: string;
    consent: boolean;
    country?: string;
  };
  setUserInfo: (info: any) => void;
  onNext: (country: string) => void;
};

export default function UserInfoPage({ userInfo, setUserInfo, onNext }: Props) {
  const [error, setError] = useState("");

  // 매핑: 사용자 선택값 → 백엔드 파일용 키
  const countryMap: Record<string, string> = {
    korean: "korea",
    japanese: "japan",
    chinese: "china",
  };

  const handleSubmit = () => {
    if (!userInfo.country) {
      setError("Please select your country.");
      return;
    }

    if (userInfo.consent) {
      if (!userInfo.email || !userInfo.gender) {
        setError("Please enter your email and select your gender.");
        return;
      }
    }

    const backendCountryKey = countryMap[userInfo.country];
    if (!backendCountryKey) {
      setError("Invalid country selected.");
      return;
    }

    onNext(backendCountryKey);
  };

  return (
    <div className="container">
      <h1 className="main-title">Survey</h1>

      <div className="content">
        {/* 설명 */}
        <div>
          <p className="paragraph">
            This survey presents an image and an AI-generated image caption, and
            asks you to evaluate the caption based on the following three
            criteria:
          </p>
          <ol className="list">
            <li>
              <strong>Cultural Appropriateness</strong>
            </li>
            <li>
              <strong>Visual Detail</strong>
            </li>
            <li>
              <strong>Hallucination</strong>
            </li>
          </ol>
          <p className="paragraph">
            Each evaluation criterion is described below along with a 1–5 point
            rating scale. Please assess the caption accordingly.
          </p>
        </div>

        {/* 동의 */}
        <p className="consent-title">
          Consent to Collection and Use of Personal Information
        </p>

        <p className="paragraph">
          <strong>
            This survey collects only minimal personal information for research
            purposes.
          </strong>{" "}
          The collected data will be used solely for research-related analysis
          and outcome generation. Additionally,{" "}
          <strong>
            we ask for your email address in order to provide a reward for
            participation.
          </strong>{" "}
          All personal information will be retained only until the end of the
          study.
        </p>

        <p className="paragraph">
          <strong>Note:</strong> If you do not consent to the collection of
          personal information, you may not be able to receive any compensation
          for participation.
        </p>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="consent"
              onChange={() => setUserInfo({ ...userInfo, consent: true })}
              checked={userInfo.consent === true}
            />{" "}
            Agree
          </label>
          <label>
            <input
              type="radio"
              name="consent"
              onChange={() =>
                setUserInfo({
                  ...userInfo,
                  consent: false,
                  gender: "",
                  email: "",
                })
              }
              checked={userInfo.consent === false}
            />{" "}
            Non-agreement
          </label>
        </div>

        {/* 성별 – 동의한 경우에만 보임 */}
        {userInfo.consent && (
          <div>
            <p className="label">Gender</p>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  onChange={() => setUserInfo({ ...userInfo, gender: "male" })}
                  checked={userInfo.gender === "male"}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  onChange={() =>
                    setUserInfo({ ...userInfo, gender: "female" })
                  }
                  checked={userInfo.gender === "female"}
                />{" "}
                Female
              </label>
            </div>
          </div>
        )}

        {/* 이메일 – 동의한 경우에만 보임 */}
        {userInfo.consent && (
          <div>
            <p className="label">E-mail</p>
            <input
              type="email"
              className="input"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
          </div>
        )}

        {/* 국가 선택 – 항상 보임 */}
        <div>
          <p className="label">Country</p>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="country"
                onChange={() =>
                  setUserInfo({ ...userInfo, country: "korean" })
                }
                checked={userInfo.country === "korean"}
              />{" "}
              Korean
            </label>
            <label>
              <input
                type="radio"
                name="country"
                onChange={() =>
                  setUserInfo({ ...userInfo, country: "chinese" })
                }
                checked={userInfo.country === "chinese"}
              />{" "}
              Chinese
            </label>
            <label>
              <input
                type="radio"
                name="country"
                onChange={() =>
                  setUserInfo({ ...userInfo, country: "japanese" })
                }
                checked={userInfo.country === "japanese"}
              />{" "}
              Japanese
            </label>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="error">{error}</p>}

        {/* 버튼 */}
        <div className="button-wrapper">
          <button onClick={handleSubmit} className="next-button">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
