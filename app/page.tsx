'use client';

import { useState } from 'react';

// AI 응답 인터페이스
interface AIResponse {
  praise: string;
  comfort: string;
  solution: string;
}

// 간단한 AI 응답 생성 로직
function generateAIResponse(userStory: string): AIResponse {
  // 감정 키워드 분석
  const sadWords = ['슬퍼', '우울', '힘들어', '절망', '외로', '아파'];
  const angryWords = ['화나', '짜증', '분노', '열받', '싫어', '스트레스'];
  const anxiousWords = ['불안', '걱정', '두려', '무서', '긴장'];
  const tiredWords = ['피곤', '지쳐', '힘없', '번아웃', '무기력'];
  
  // 상황 키워드 분석
  const workWords = ['회사', '직장', '업무', '상사', '동료', '일'];
  const relationshipWords = ['연애', '남친', '여친', '헤어', '사랑'];
  const studyWords = ['공부', '시험', '학교', '성적', '대학'];
  
  const text = userStory.toLowerCase();
  
  // 감정 분석
  let emotion = 'neutral';
  if (sadWords.some(word => text.includes(word))) emotion = 'sad';
  else if (angryWords.some(word => text.includes(word))) emotion = 'angry';
  else if (anxiousWords.some(word => text.includes(word))) emotion = 'anxious';
  else if (tiredWords.some(word => text.includes(word))) emotion = 'tired';
  
  // 상황 분석
  let situation = 'general';
  if (workWords.some(word => text.includes(word))) situation = 'work';
  else if (relationshipWords.some(word => text.includes(word))) situation = 'relationship';
  else if (studyWords.some(word => text.includes(word))) situation = 'study';
  
  // 맞춤형 응답 생성
  const responses = {
    praise: {
      general: "이렇게 용감하게 마음을 나누어 주셔서 정말 감사해요. 어려운 상황에서도 해결책을 찾으려는 모습이 대단합니다. 💪",
      work: "직장에서의 어려움을 잘 견뎌내고 계시는군요. 업무 스트레스 속에서도 균형을 찾으려는 노력이 보여요. 💪",
      relationship: "관계에서 진심을 다하는 모습이 아름다워요. 사랑하는 마음 자체가 이미 충분히 가치있어요. 💪",
      study: "학업에 대한 열정과 노력이 정말 대단해요. 목표를 향해 꾸준히 나아가는 모습이 인상적이에요. 💪"
    },
    comfort: {
      sad: "마음이 많이 아프셨을 것 같아요. 슬픈 감정을 느끼는 것은 자연스러운 일이고, 지금의 아픔이 영원하지 않다는 것을 기억해 주세요. 💝",
      angry: "화가 나는 것도 당연해요. 그 감정을 인정하고 받아들이는 것이 중요해요. 분노를 긍정적으로 활용할 수 있을 거예요. 💝",
      anxious: "불안한 마음, 충분히 이해해요. 깊게 숨을 들이쉬고 천천히 내쉬어보세요. 지금 이 순간에 집중하면서 한 걸음씩 나아가면 돼요. 💝",
      tired: "정말 많이 피곤하셨겠어요. 충분한 휴식을 취하는 것도 중요한 일이에요. 때로는 잠시 멈춰 서서 자신을 돌보는 시간이 필요해요. 💝",
      neutral: "당신의 마음을 이해하고 있어요. 어떤 감정이든 소중하고, 당신은 혼자가 아니라는 것을 기억해 주세요. 💝"
    },
    solution: {
      work: "업무 스트레스는 작은 휴식부터 시작해보세요. 점심시간에 잠깐 산책하거나 동료와의 소통을 늘려보세요. 당신은 충분히 해낼 수 있어요. 💡",
      relationship: "솔직한 대화가 관계 개선의 첫걸음이에요. 상대방의 입장도 생각해보고, 자신을 먼저 사랑하는 것부터 시작해보세요. 💡",
      study: "목표를 작은 단위로 나누어 하나씩 달성해나가세요. 완벽을 추구하기보다는 꾸준함을 추구하는 것이 더 중요해요. 💡",
      general: "한 번에 모든 것을 해결하려 하지 마시고, 작은 것부터 차근차근 시작해보세요. 믿을 만한 사람과 대화하는 것도 큰 도움이 됩니다. 💡"
    }
  };
  
  return {
    praise: responses.praise[situation] || responses.praise.general,
    comfort: responses.comfort[emotion] || responses.comfort.neutral,
    solution: responses.solution[situation] || responses.solution.general
  };
}

async function getAIResponse(userStory: string): Promise<AIResponse> {
  // 처리 시간 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  return generateAIResponse(userStory);
}

export default function Home() {
  const [story, setStory] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim()) return;

    setLoading(true);
    
    try {
      // 스마트 AI 응답 생성
      const aiResponse = await getAIResponse(story);
      setResponse(aiResponse);
    } catch (error) {
      console.error('AI 응답 생성 중 오류:', error);
      // 오류 시 기본 응답
      setResponse({
        praise: "이렇게 용감하게 마음을 나누어 주셔서 감사해요. 💪",
        comfort: "지금 힘든 시간을 보내고 계시는군요. 당신은 혼자가 아니에요. 💝",
        solution: "작은 것부터 하나씩 시작해보세요. 당신은 할 수 있어요. 💡"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStory('');
    setResponse(null);
  };

  // 파티클 생성 함수
  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      );
    }
    return particles;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 파티클 시스템 */}
      <div className="particles">
        {createParticles()}
      </div>
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-5xl mx-auto py-12">
          {/* 3D 플로팅 헤더 */}
          <div className="text-center mb-16 floating">
            <div className="glass card-3d p-8 mb-8 glow">
              <h1 className="text-5xl md:text-7xl font-bold text-gradient-rainbow mb-6">
                💝 마음이 쉬는 곳
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                당신의 이야기를 들려주세요 ✨<br/>
                <span className="text-lg opacity-80">따뜻한 칭찬과 위로, 그리고 도움이 되는 조언을 드릴게요</span>
              </p>
            </div>
          </div>

        {!response ? (
          /* 3D 이야기 입력 폼 */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="card-3d glass p-10 tilt-effect">
              <div className="relative z-10">
                <label className="block text-2xl font-bold text-white mb-6 text-center">
                  <span className="text-gradient">오늘 어떤 일이 있으셨나요?</span> 
                  <br/>
                  <span className="text-lg font-normal text-white/80 mt-2 block">편하게 이야기해 주세요 ✨</span>
                </label>
                <div className="relative">
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="여기에 당신의 이야기를 자유롭게 적어주세요. 어떤 감정이든, 어떤 상황이든 괜찮아요..."
                    className="w-full h-48 p-6 glass border-2 border-white/20 rounded-2xl resize-none focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 text-white placeholder-white/60 leading-relaxed text-lg backdrop-blur-md"
                    disabled={loading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                </div>
                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    disabled={!story.trim() || loading}
                    className="btn-3d touch-effect glow px-12 py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <div className="spinner-3d w-6 h-6"></div>
                        마음을 읽고 있어요... 💭
                      </span>
                    ) : (
                      '이야기 들려주기 💌'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : loading ? (
          /* 3D 로딩 상태 */
          <div className="text-center py-20">
            <div className="card-3d glass p-12 mx-auto max-w-md floating">
              <div className="spinner-3d mx-auto mb-8"></div>
              <h3 className="text-2xl font-bold text-white mb-4 text-gradient">
                마음을 읽고 있어요...
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                당신의 이야기를 소중히 들으며<br/>
                따뜻한 답변을 준비하고 있습니다 ✨
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </div>
        ) : (
          /* 3D AI 응답 카드들 */
          <div className="space-y-8">
            {/* 칭찬 카드 */}
            <div className="card-3d glass p-8 stagger-fade-in glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl floating">🎉</span>
                  <span className="text-gradient">당신이 정말 잘하고 있는 것들</span>
                </h3>
                <p className="text-white/90 leading-relaxed text-lg font-light">{response.praise}</p>
              </div>
            </div>

            {/* 위로 카드 */}
            <div className="card-3d glass p-8 stagger-fade-in glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl floating" style={{animationDelay: '1s'}}>💝</span>
                  <span className="text-gradient">따뜻한 위로의 말</span>
                </h3>
                <p className="text-white/90 leading-relaxed text-lg font-light">{response.comfort}</p>
              </div>
            </div>

            {/* 해결책 카드 */}
            <div className="card-3d glass p-8 stagger-fade-in glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl floating" style={{animationDelay: '2s'}}>💡</span>
                  <span className="text-gradient">도움이 될 만한 조언</span>
                </h3>
                <p className="text-white/90 leading-relaxed text-lg font-light">{response.solution}</p>
              </div>
            </div>

            {/* 새로운 이야기 버튼 */}
            <div className="text-center pt-8 stagger-fade-in">
              <button
                onClick={resetForm}
                className="btn-3d touch-effect px-10 py-4 text-lg font-bold bg-gradient-to-r from-slate-600 to-slate-700"
                style={{
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  boxShadow: '0 10px 20px rgba(100, 116, 139, 0.4), 0 6px 6px rgba(100, 116, 139, 0.1), inset 0 -2px 5px 1px rgba(100, 116, 139, 0.6), inset 0 -1px 1px 3px rgba(100, 116, 139, 0.8), inset 0 2px 1px rgba(255, 255, 255, 0.3)'
                }}
              >
                새로운 이야기 나누기 🔄
              </button>
            </div>
          </div>
        )}

          {/* 3D 푸터 */}
          <div className="text-center mt-20">
            <div className="glass card-3d p-6 max-w-2xl mx-auto">
              <p className="text-white/80 text-lg leading-relaxed">
                💝 <span className="text-gradient font-semibold">모든 이야기는 소중하고, 당신은 혼자가 아닙니다.</span><br/>
                <span className="text-sm text-white/60 mt-2 block">전문적인 도움이 필요하다면 주저하지 마세요.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
