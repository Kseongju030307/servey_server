import { useState } from "react";
import UserInfoPage from "./UserInfoPage";
import InstructionPage from "./InstructionPage";
import EvaluationPage, { CaptionInfo } from "./EvaluationPage";

type Evaluation = {
  Cultural_Appropriateness: number | null;
  Visual_Detail: number | null;
  Hallucination: number | null;
};

// 도메인 상수 정의
const BASE_URL = "https://survey.culturesurvey.xyz";

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function App() {
  const [step, setStep] = useState<"userinfo" | "instruction" | "evaluation" | "done">("userinfo");

  const [userInfo, setUserInfo] = useState({
    gender: "",
    email: "",
    consent: false,
    country: "",
  });

  const [imageData, setImageData] = useState<any>(null);
  const [shuffledCaptions, setShuffledCaptions] = useState<CaptionInfo[]>([]);
  const [allScores, setAllScores] = useState<Record<string, Evaluation>>({});
  const [showInstructionOnce, setShowInstructionOnce] = useState(true);

  const handleUserNext = async (country: string) => {
    setUserInfo((prev) => ({ ...prev, country }));

    try {
      const res = await fetch(`${BASE_URL}/api/get-sample/?country=${country}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ 백엔드 에러:", errorData);
        alert(`⚠️ 데이터를 불러오지 못했습니다.\n${errorData.error || "알 수 없는 오류"}`);
        return;
      }

      const data = await res.json();
      console.log("✅ 받아온 데이터:", data);

      if (!data.level2 || !data.level3 || !data.level4) {
        alert("⚠️ 캡션 데이터가 부족합니다.");
        return;
      }

      setImageData(data);

      const captionsArray: CaptionInfo[] = [
        { level: "level2", caption: data.level2.caption },
        { level: "level3", caption: data.level3.caption },
        { level: "level4", caption: data.level4.caption },
      ];

      const shuffled = shuffleArray(captionsArray);
      setShuffledCaptions(shuffled);

      const initialScores = Object.fromEntries(
        shuffled.map((c) => [
          c.level,
          {
            Cultural_Appropriateness: null,
            Visual_Detail: null,
            Hallucination: null,
          },
        ])
      );
      setAllScores(initialScores);

      if (showInstructionOnce) {
        setStep("instruction");
        setShowInstructionOnce(false);
      } else {
        setStep("evaluation");
      }
    } catch (err) {
      console.error("❌ fetch 실패:", err);
      alert("⚠️ 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleEvaluationSubmit = async (evaluations: Record<string, any>) => {
    if (!imageData) return;

    const payload = {
      email: userInfo.email,
      gender: userInfo.gender,
      country: userInfo.country,
      consent: userInfo.consent,
      image_path: imageData.image_path,
      json_data: evaluations,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/evaluate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ 저장 완료");
        await handleUserNext(userInfo.country);
      } else {
        console.error("❌ 서버 오류", await response.text());
        alert("서버 오류 발생");
      }
    } catch (error) {
      console.error("❌ 네트워크 오류", error);
      alert("서버 연결 실패");
    }
  };

  return (
    <>
      {step === "userinfo" && (
        <UserInfoPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          onNext={handleUserNext}
        />
      )}

      {step === "instruction" && (
        <InstructionPage onStart={() => setStep("evaluation")} />
      )}

      {step === "evaluation" && imageData && (
        <EvaluationPage
          imageUrl={`${BASE_URL}${imageData.image_path}`} // 절대경로로 변경
          captions={shuffledCaptions}
          allScores={allScores}
          setAllScores={setAllScores}
          onSubmit={handleEvaluationSubmit}
          category={imageData.category}
          item={imageData.item}
          nation={imageData.nation}
          fullCaption={imageData.caption.caption}
        />
      )}

      {step === "done" && (
        <div className="container">
          <h2>✅ All evaluations completed!</h2>
        </div>
      )}
    </>
  );
}
