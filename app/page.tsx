'use client';

import { useState, useEffect } from 'react';

// AI 응답 인터페이스
interface AIResponse {
  praise: string;
  comfort: string;
  solution: string;
}

// 대화 기록 인터페이스
interface ConversationHistory {
  id: string;
  date: string;
  userMessage: string;
  aiResponse: AIResponse;
}

export default function Home() {
  const [story, setStory] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [particles, setParticles] = useState<React.JSX.Element[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 사용자 ID 생성 함수
  const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // 컴포넌트 마운트 시 사용자 ID 설정 및 히스토리 로드
  useEffect(() => {
    // 기존 사용자 ID 확인
    let existingUserId = localStorage.getItem('vibeCodingUserId');
    
    if (!existingUserId) {
      // 새로운 사용자라면 ID 생성
      existingUserId = generateUserId();
      localStorage.setItem('vibeCodingUserId', existingUserId);
    }
    
    setUserId(existingUserId);
    
    // 해당 사용자의 히스토리 로드
    const savedHistory = localStorage.getItem(`conversationHistory_${existingUserId}`);
    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('히스토리 로드 중 오류:', error);
      }
    }
  }, []);

  // 파티클 생성 함수 - 클라이언트에서만 실행
  useEffect(() => {
    if (!isClient) return;

    const createParticles = () => {
      const particleElements = [];
      for (let i = 0; i < 15; i++) {
        particleElements.push(
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
      setParticles(particleElements);
    };

    createParticles();
  }, [isClient]);

  // 히스토리 저장 함수
  const saveToHistory = (userMessage: string, aiResponse: AIResponse) => {
    const newConversation: ConversationHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ko-KR'),
      userMessage,
      aiResponse
    };

    const updatedHistory = [newConversation, ...conversationHistory];
    setConversationHistory(updatedHistory);
    
    try {
      localStorage.setItem(`conversationHistory_${userId}`, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('히스토리 저장 중 오류:', error);
    }
  };

  // 히스토리 삭제 함수
  const deleteHistory = (id: string) => {
    const updatedHistory = conversationHistory.filter(item => item.id !== id);
    setConversationHistory(updatedHistory);
    
    try {
      localStorage.setItem(`conversationHistory_${userId}`, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('히스토리 삭제 중 오류:', error);
    }
  };

  // 전체 히스토리 삭제 함수
  const clearAllHistory = () => {
    setConversationHistory([]);
    localStorage.removeItem(`conversationHistory_${userId}`);
  };

  // 새로운 사용자로 시작하는 함수
  const startAsNewUser = () => {
    const newUserId = generateUserId();
    localStorage.setItem('vibeCodingUserId', newUserId);
    setUserId(newUserId);
    setConversationHistory([]);
    localStorage.removeItem(`conversationHistory_${userId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: story }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API 할당량 초과 에러 처리
        if (res.status === 429) {
          const errorMsg = 'API 할당량이 부족합니다. 잠시 후 다시 시도해주세요.';
          setError(errorMsg);
          
          // 대안 응답 제공
          const fallbackResponse = {
            praise: "당신의 이야기를 들려주셔서 정말 감사해요. 용감하게 마음을 나누어 주신 모습이 대단해요. 어떤 상황이든 당신은 충분히 잘하고 있고, 이런 용기 있는 모습이 정말 멋져요.",
            comfort: "지금 힘든 시간을 보내고 계시는군요. 그런 감정을 느끼는 것은 완전히 자연스러운 일이에요. 당신은 혼자가 아니고, 이런 경험을 통해 더욱 성장하고 계신 거예요.",
            solution: "작은 것부터 하나씩 차근차근 시작해보세요. 완벽하지 않아도 괜찮아요. 당신은 충분히 할 수 있어요! 전문적인 도움이 필요하다면 언제든 상담사와 상담하는 것도 좋은 방법이에요."
          };
          setResponse(fallbackResponse);
          saveToHistory(story, fallbackResponse);
          return;
        }
        throw new Error(data.error || '서버 오류가 발생했습니다.');
      }

      // ChatGPT 응답을 세 개의 섹션으로 분리
      const aiResponse = data.response;
      const sections = parseAIResponse(aiResponse);
      setResponse(sections);
      saveToHistory(story, sections);
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      
      // API 할당량 초과 시 대안 응답 제공
      if (errorMessage.includes('할당량')) {
        const fallbackResponse = {
          praise: "당신의 이야기를 들려주셔서 정말 감사해요. 용감하게 마음을 나누어 주신 모습이 대단해요. 어떤 상황이든 당신은 충분히 잘하고 있고, 이런 용기 있는 모습이 정말 멋져요.",
          comfort: "지금 힘든 시간을 보내고 계시는군요. 그런 감정을 느끼는 것은 완전히 자연스러운 일이에요. 당신은 혼자가 아니고, 이런 경험을 통해 더욱 성장하고 계신 거예요.",
          solution: "작은 것부터 하나씩 차근차근 시작해보세요. 완벽하지 않아도 괜찮아요. 당신은 충분히 할 수 있어요! 전문적인 도움이 필요하다면 언제든 상담사와 상담하는 것도 좋은 방법이에요."
        };
        setResponse(fallbackResponse);
        saveToHistory(story, fallbackResponse);
      }
    } finally {
      setLoading(false);
    }
  };

  // AI 응답을 세 개의 섹션으로 분리하는 함수
  const parseAIResponse = (aiResponse: string): AIResponse => {
    // 기본 분리 로직
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    // 섹션별로 분리
    let praise = '';
    let comfort = '';
    let solution = '';
    
    let currentSection = '';
    
    for (const line of lines) {
      // 번호나 섹션 표시 제거하고 키워드로만 판단
      if (line.includes('칭찬') || line.includes('잘한') || line.includes('대단한') || line.includes('멋져요') || line.includes('첫 번째')) {
        currentSection = 'praise';
      } else if (line.includes('위로') || line.includes('공감') || line.includes('이해') || line.includes('자연스러워요') || line.includes('두 번째')) {
        currentSection = 'comfort';
      } else if (line.includes('해결') || line.includes('조언') || line.includes('방법') || line.includes('링크') || line.includes('추천') || line.includes('세 번째')) {
        currentSection = 'solution';
      }
      
      // 번호나 섹션 표시가 아닌 실제 내용만 추가
      if (!line.match(/^\d+\./) && !line.includes('섹션') && !line.includes('부분')) {
        if (currentSection === 'praise') {
          praise += line + '\n';
        } else if (currentSection === 'comfort') {
          comfort += line + '\n';
        } else if (currentSection === 'solution') {
          solution += line + '\n';
        }
      }
    }
    
    // 분리되지 않은 경우 기본 응답으로 처리
    if (!praise && !comfort && !solution) {
      const parts = aiResponse.split('\n\n');
      if (parts.length >= 3) {
        praise = parts[0] || "당신의 이야기를 들려주셔서 감사해요. 용감하게 마음을 나누어 주신 모습이 대단해요.";
        comfort = parts[1] || "지금 힘든 시간을 보내고 계시는군요. 그런 감정을 느끼는 것은 자연스러운 일이에요.";
        solution = parts[2] || "작은 것부터 하나씩 시작해보세요. 완벽하지 않아도 괜찮아요.";
      } else {
        // 단일 응답인 경우 균등하게 분할
        const length = aiResponse.length;
        const partLength = Math.floor(length / 3);
        praise = aiResponse.slice(0, partLength) || "당신의 이야기를 들려주셔서 감사해요. 용감하게 마음을 나누어 주신 모습이 대단해요.";
        comfort = aiResponse.slice(partLength, partLength * 2) || "지금 힘든 시간을 보내고 계시는군요. 그런 감정을 느끼는 것은 자연스러운 일이에요.";
        solution = aiResponse.slice(partLength * 2) || "작은 것부터 하나씩 시작해보세요. 완벽하지 않아도 괜찮아요.";
      }
    }
    
    return {
      praise: praise.trim() || "당신의 이야기를 들려주셔서 감사해요. 용감하게 마음을 나누어 주신 모습이 대단해요.",
      comfort: comfort.trim() || "지금 힘든 시간을 보내고 계시는군요. 그런 감정을 느끼는 것은 자연스러운 일이에요.",
      solution: solution.trim() || "작은 것부터 하나씩 시작해보세요. 완벽하지 않아도 괜찮아요."
    };
  };

  // 링크를 클릭 가능하게 만드는 함수
  const renderTextWithLinks = (text: string) => {
    // URL 패턴을 찾아서 링크로 변환
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline transition-colors duration-200"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const resetForm = () => {
    setStory('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 파티클 시스템 - 클라이언트에서만 렌더링 */}
      {isClient && (
        <div className="particles">
          {particles}
        </div>
      )}
      
      {/* 히스토리 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn-3d touch-effect px-4 py-2 text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600"
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
            boxShadow: '0 4px 8px rgba(147, 51, 234, 0.4), 0 2px 4px rgba(147, 51, 234, 0.1), inset 0 -1px 2px 1px rgba(147, 51, 234, 0.6), inset 0 -1px 1px 2px rgba(147, 51, 234, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          📖 히스토리
        </button>
      </div>

      {/* 히스토리 모달 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">나의 감정 일기장</h2>
              <div className="flex gap-2">
                <button
                  onClick={startAsNewUser}
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  title="새로운 사용자로 시작 (기존 데이터 삭제)"
                >
                  새로 시작
                </button>
                <button
                  onClick={clearAllHistory}
                  className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  전체 삭제
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
            
            {conversationHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">아직 대화 기록이 없어요.</p>
                <p className="text-white/40 text-sm mt-2">이야기를 나누면 여기에 저장됩니다.</p>
                <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    💡 <strong>개인정보 보호:</strong> 모든 데이터는 이 기기에만 저장되며, 
                    다른 사용자와 공유되지 않습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {conversationHistory.map((conversation) => (
                  <div key={conversation.id} className="glass border border-white/20 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-white/60 text-sm">{conversation.date}</span>
                      <button
                        onClick={() => deleteHistory(conversation.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">내 이야기</h4>
                      <p className="text-white/80 bg-white/10 rounded-lg p-3">{conversation.userMessage}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h5 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                          <span>✨</span> 칭찬
                        </h5>
                        <p className="text-white/90">{conversation.aiResponse.praise}</p>
                      </div>
                      
                      <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
                        <h5 className="text-pink-300 font-semibold mb-2 flex items-center gap-2">
                          <span>💫</span> 위로
                        </h5>
                        <p className="text-white/90">{conversation.aiResponse.comfort}</p>
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h5 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                          <span>🌟</span> 해결책
                        </h5>
                        <div className="text-white/90">
                          {renderTextWithLinks(conversation.aiResponse.solution)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-5xl mx-auto py-12">
          {/* 3D 플로팅 헤더 */}
          <div className="text-center mb-16 floating">
            <div className="glass card-3d p-8 mb-8 glow">
              <h1 className="text-5xl md:text-7xl font-bold text-gradient-rainbow mb-6">
                마음이 쉬는 곳
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                당신의 이야기를 들려주세요<br/>
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
                  <span className="text-lg font-normal text-white/80 mt-2 block">편하게 이야기해 주세요</span>
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
                
                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-300 text-center">{error}</p>
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    disabled={!story.trim() || loading}
                    className="btn-3d touch-effect glow px-12 py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <div className="spinner-3d w-6 h-6"></div>
                        AI가 답변을 준비하고 있어요...
                      </span>
                    ) : (
                      '이야기 들려주기'
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
                AI가 답변을 준비하고 있어요...
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                당신의 이야기를 소중히 들으며<br/>
                따뜻한 답변을 준비하고 있습니다
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
                  <span className="text-4xl floating">✨</span>
                  <span className="text-gradient">당신이 정말 잘하고 있는 것들</span>
                </h3>
                <p className="text-white/90 leading-relaxed text-lg font-light whitespace-pre-wrap">{response.praise}</p>
              </div>
            </div>

            {/* 위로 카드 */}
            <div className="card-3d glass p-8 stagger-fade-in glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl floating" style={{animationDelay: '1s'}}>💫</span>
                  <span className="text-gradient">따뜻한 위로의 말</span>
                </h3>
                <p className="text-white/90 leading-relaxed text-lg font-light whitespace-pre-wrap">{response.comfort}</p>
              </div>
            </div>

            {/* 해결책 카드 */}
            <div className="card-3d glass p-8 stagger-fade-in glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl floating" style={{animationDelay: '2s'}}>🌟</span>
                  <span className="text-gradient">도움이 될 만한 조언</span>
                </h3>
                <div className="text-white/90 leading-relaxed text-lg font-light whitespace-pre-wrap">
                  {renderTextWithLinks(response.solution)}
                </div>
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
                새로운 이야기 나누기
              </button>
            </div>
          </div>
        )}

          {/* 3D 푸터 */}
          <div className="text-center mt-20">
            <div className="glass card-3d p-6 max-w-2xl mx-auto">
              <p className="text-white/80 text-lg leading-relaxed">
                <span className="text-gradient font-semibold">모든 이야기는 소중하고, 당신은 혼자가 아닙니다.</span><br/>
                <span className="text-sm text-white/60 mt-2 block">전문적인 도움이 필요하다면 주저하지 마세요.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
