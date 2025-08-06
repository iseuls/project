#!/bin/bash

echo "🚀 감정 읽기 사이트 설정 도우미"
echo "================================"

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# API 키 설정
echo ""
echo "🔑 OpenAI API 키 설정"
echo "1. https://platform.openai.com/api-keys 에서 API 키를 발급받으세요"
echo "2. 아래에 API 키를 입력하세요:"
read -p "API 키: " api_key

if [ -n "$api_key" ]; then
    echo "OPENAI_API_KEY=$api_key" > .env.local
    echo "✅ API 키가 설정되었습니다!"
else
    echo "⚠️  API 키가 입력되지 않았습니다."
    echo "나중에 .env.local 파일을 직접 수정하세요."
fi

echo ""
echo "🎉 설정 완료!"
echo "다음 명령어로 서버를 실행하세요:"
echo "npm run dev" 