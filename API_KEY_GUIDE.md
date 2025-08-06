# API 키 발급 및 문제 해결 가이드 🔑

## 🚨 현재 문제: API 할당량 초과

현재 사용 중인 API 키의 할당량이 초과되었습니다.

## 🔧 해결 방법

### 1. 새로운 API 키 발급

1. **OpenAI Platform 방문**
   - https://platform.openai.com/api-keys

2. **새 API 키 생성**
   - "Create new secret key" 클릭
   - 키 이름 입력 (예: "감정읽기사이트")
   - "Create secret key" 클릭

3. **API 키 복사**
   - 생성된 키를 안전한 곳에 복사

### 2. 환경 변수 업데이트

```bash
# .env.local 파일 수정
echo "OPENAI_API_KEY=새로운_API_키_입력" > .env.local
```

### 3. 서버 재시작

```bash
# 서버 재시작
npm run dev
```

## 💡 무료 할당량 정보

- **무료 계정**: 월 $5 크레딧
- **사용량 확인**: https://platform.openai.com/usage
- **결제 설정**: https://platform.openai.com/account/billing

## 🛠️ 대안 해결책

### 1. 결제 정보 추가
- OpenAI 계정에 결제 정보 추가
- 더 많은 할당량 사용 가능

### 2. 다른 API 키 사용
- 여러 API 키를 번갈아 사용
- 각 키의 할당량 분산

### 3. 사용량 최적화
- API 호출 빈도 줄이기
- 토큰 사용량 최적화

## 📞 지원

문제가 지속되면:
1. OpenAI 지원팀 문의
2. GitHub 이슈 생성
3. 개발자 커뮤니티 활용 