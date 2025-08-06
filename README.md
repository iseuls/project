# 💝 마음이 쉬는 곳 - AI 상담사

따뜻하고 공감적인 AI 상담사가 당신의 이야기를 들어드리고, 칭찬과 위로, 그리고 실용적인 조언을 제공합니다.

## ✨ 주요 기능

- **🤖 GPT-4o 모델**: 최신 AI 모델을 사용한 정교한 답변
- **🔍 실시간 웹 검색**: Google Custom Search API를 통한 최신 정보 제공
- **💝 세 가지 섹션**: 칭찬, 위로, 해결책으로 구분된 답변
- **🔗 유용한 링크**: 관련 전문가, 상담소, 도움말 사이트 추천
- **🎨 아름다운 UI**: 3D 효과와 애니메이션이 적용된 현대적인 디자인

## 🚀 빠른 시작

### 1. 프로젝트 클론
```bash
git clone https://github.com/iseuls/project.git vibe-coding-2
cd vibe-coding-2
```

### 2. 의존성 설치
```bash
npm install
```

### 3. API 키 설정

#### OpenAI API 키
1. [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 발급
2. `.env.local` 파일에 추가:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

#### Google Custom Search API (선택사항)
웹 검색 기능을 사용하려면:
1. [Google Cloud Console](https://console.cloud.google.com/)에서 API 키 생성
2. [Google Programmable Search Engine](https://programmablesearchengine.google.com/)에서 검색 엔진 생성
3. `.env.local` 파일에 추가:
```bash
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id_here
```

자세한 설정 방법은 [GOOGLE_SEARCH_SETUP.md](./GOOGLE_SEARCH_SETUP.md)를 참조하세요.

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저에서 접속
```
http://localhost:3000
```

## 🎯 사용 방법

1. **이야기 입력**: 텍스트 영역에 당신의 고민이나 일상을 자유롭게 적어주세요
2. **AI 분석**: GPT-4o가 당신의 이야기를 분석하고 웹 검색을 통해 최신 정보를 수집합니다
3. **세 가지 답변**: 
   - **🎉 칭찬**: 당신이 잘하고 있는 것들을 칭찬
   - **💝 위로**: 따뜻한 공감과 위로
   - **💡 해결책**: 구체적인 조언과 유용한 링크

## 🔍 웹 검색 기능

다음 키워드가 포함된 메시지에 대해 자동으로 웹 검색이 수행됩니다:

- **정신건강**: 상담사, 심리상담, 정신건강, 스트레스 관리, 불안증, 우울증
- **자기계발**: 자기계발, 명상, 요가, 운동, 영양, 수면, 취미활동
- **상담**: 직업상담, 학업상담, 인간관계, 커뮤니케이션, 감정관리

## 🛠 기술 스택

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o
- **Search**: Google Custom Search API
- **Styling**: Custom CSS with 3D effects

## 🔧 문제 해결

### API 할당량 초과
- OpenAI API 키를 새로 발급받아 `.env.local` 파일을 업데이트
- 서버 재시작: `npm run dev`

### 웹 검색이 작동하지 않는 경우
- Google Custom Search API 설정 확인
- [GOOGLE_SEARCH_SETUP.md](./GOOGLE_SEARCH_SETUP.md) 참조

자세한 문제 해결 방법은 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)를 참조하세요.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

버그 리포트나 기능 제안은 언제든 환영합니다!

---

💝 **모든 이야기는 소중하고, 당신은 혼자가 아닙니다.** 💝
