# Google Custom Search API 설정 가이드

## 🔍 웹 검색 기능 추가

이제 AI가 실시간 웹 검색을 통해 더 정확하고 최신 정보를 제공할 수 있습니다!

## 📋 설정 단계

### 1. Google Cloud Console에서 API 키 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** → **라이브러리**로 이동
4. **Custom Search API** 검색 후 활성화
5. **사용자 인증 정보** → **사용자 인증 정보 만들기** → **API 키**
6. 생성된 API 키 복사

### 2. Google Custom Search Engine 생성

1. [Google Programmable Search Engine](https://programmablesearchengine.google.com/)에 접속
2. **새 검색 엔진 만들기** 클릭
3. **웹사이트 검색** 선택
4. **검색할 사이트**: `www.google.com` (전체 웹 검색)
5. **검색 엔진 이름**: 원하는 이름 입력
6. **만들기** 클릭
7. **검색 엔진 ID** 복사 (예: `012345678901234567890:abcdefghijk`)

### 3. 환경 변수 설정

`.env.local` 파일에 다음을 추가하세요:

```bash
GOOGLE_SEARCH_API_KEY=your_actual_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
```

### 4. 서버 재시작

```bash
npm run dev
```

## 🚀 기능 설명

### 검색 트리거 키워드
다음 키워드가 포함된 메시지에 대해 웹 검색이 자동으로 수행됩니다:

- **정신건강**: 상담사, 심리상담, 정신건강, 스트레스 관리, 불안증, 우울증
- **자기계발**: 자기계발, 명상, 요가, 운동, 영양, 수면, 취미활동
- **상담**: 직업상담, 학업상담, 인간관계, 커뮤니케이션, 감정관리

### 검색 결과 활용
- AI가 웹 검색 결과를 참고하여 최신 정보 제공
- 관련 전문가, 상담소, 도움말 사이트 링크 추천
- 구체적이고 실용적인 조언 제공

## 💡 사용 예시

**사용자 입력**: "요즘 스트레스가 너무 심해요. 어떻게 관리하면 좋을까요?"

**AI 응답**:
- **칭찬**: 스트레스를 인식하고 해결하려는 모습이 정말 대단해요!
- **위로**: 스트레스를 느끼는 것은 자연스러운 일이에요.
- **해결책**: 웹 검색을 통해 최신 스트레스 관리법과 전문 상담소 정보 제공

## 🔧 문제 해결

### API 할당량 초과
- Google Cloud Console에서 할당량 확인
- 필요시 유료 플랜으로 업그레이드

### 검색 결과 없음
- Custom Search Engine 설정 확인
- 검색 키워드 조정

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. API 키가 올바르게 설정되었는지
2. Custom Search Engine ID가 정확한지
3. 서버가 재시작되었는지

---

이제 AI가 실시간 웹 검색을 통해 더욱 정확하고 유용한 정보를 제공할 수 있습니다! 🚀✨ 