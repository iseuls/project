# API 키 문제 해결 가이드 🔧

## 🚨 현재 문제: API 할당량 초과 (429 에러)

### 문제 원인:
1. **API 키 할당량 초과**: 현재 키의 사용량 한도 도달
2. **무료 계정 한도**: 월 $5 크레딧 소진
3. **유료 계정 한도**: 설정된 사용량 제한 도달

### 해결 방법:

#### 1. 새로운 API 키 발급 (추천)
```bash
# 1. OpenAI Platform 방문
# https://platform.openai.com/api-keys

# 2. 새 API 키 생성
# - "Create new secret key" 클릭
# - 키 이름 입력 (예: "감정읽기사이트-v2")
# - "Create secret key" 클릭

# 3. 환경 변수 업데이트
echo "OPENAI_API_KEY=새로운_API_키" > .env.local

# 4. 서버 재시작
npm run dev
```

#### 2. 기존 API 키 확인
```bash
# 현재 API 키 확인
cat .env.local

# API 키 형식 확인 (sk-로 시작해야 함)
```

#### 3. OpenAI 계정 확인
- **사용량 확인**: https://platform.openai.com/usage
- **결제 정보**: https://platform.openai.com/account/billing
- **API 키 관리**: https://platform.openai.com/api-keys

### 🔍 문제 진단:

#### 1. API 키 형식 확인
```bash
# 올바른 형식: sk-로 시작
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 2. 사용량 확인
- OpenAI Platform → Usage 페이지
- 현재 사용량과 한도 확인

#### 3. 결제 정보 확인
- OpenAI Platform → Billing 페이지
- 결제 방법 등록 여부 확인

### 💡 예방 방법:

#### 1. 여러 API 키 사용
```bash
# 키1
OPENAI_API_KEY=sk-key1-xxxxxxxxx

# 키2 (백업용)
OPENAI_API_KEY=sk-key2-xxxxxxxxx
```

#### 2. 사용량 모니터링
- 정기적으로 사용량 확인
- 한도에 도달하기 전에 조치

#### 3. 무료 대안 제공
- API 할당량 초과 시에도 사용자 경험 유지
- 대안 응답 시스템 구현

### 🆘 긴급 해결:

#### 1. 즉시 해결
```bash
# 1. 새 API 키 발급
# 2. .env.local 파일 수정
# 3. 서버 재시작
```

#### 2. 임시 해결
- 현재 구현된 대안 응답 시스템 활용
- 사용자에게 해결 방법 안내

### 📞 추가 지원:
- OpenAI 지원팀: https://help.openai.com/
- GitHub 이슈: 프로젝트 저장소에 이슈 생성
- 개발자 커뮤니티: Stack Overflow, Reddit 등 