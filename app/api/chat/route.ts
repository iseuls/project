import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Custom Search API 설정
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CUSTOM_SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

// 웹 검색 함수
async function searchWeb(query: string) {
  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_CUSTOM_SEARCH_ENGINE_ID) {
    console.log('Google Search API 키가 설정되지 않았습니다.');
    return null;
  }

  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link
      }));
    }
    return null;
  } catch (error) {
    console.error('웹 검색 중 오류:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 웹 검색 수행
    let searchResults = null;
    let searchContext = '';
    
    // 검색이 필요한 키워드들
    const searchKeywords = [
      '상담사', '심리상담', '정신건강', '스트레스 관리', '불안증', '우울증',
      '자기계발', '명상', '요가', '운동', '영양', '수면', '취미활동',
      '직업상담', '학업상담', '인간관계', '커뮤니케이션', '감정관리',
      '입맛', '식욕', '음식', '요리', '레시피', '식당', '맛집',
      '취미', '활동', '운동', '명상', '독서', '영화', '음악',
      '여행', '산책', '등산', '수영', '요가', '필라테스', '헬스',
      '스트레스', '불안', '우울', '피로', '수면', '휴식', '명상'
    ];

    // 메시지에서 검색 키워드 확인
    const needsSearch = searchKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (needsSearch) {
      // 관련 검색어 생성
      const searchQuery = `${message} 해결방법 추천 도움`;
      searchResults = await searchWeb(searchQuery);
      
      if (searchResults) {
        searchContext = '\n\n[웹 검색 결과]\n' + 
          searchResults.map((result: any, index: number) => 
            `${index + 1}. ${result.title}\n${result.snippet}\n링크: ${result.link}`
          ).join('\n\n');
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `당신은 따뜻하고 공감적인 AI 상담사입니다. 사용자의 일상 이야기를 듣고 다음 세 가지 부분으로 나누어 자연스럽게 답변해주세요:

첫 번째 부분 (칭찬):
  - 사용자가 잘하고 있는 구체적인 행동들을 찾아 칭찬해주세요
  - 용기, 인내, 성장 등 긍정적인 면을 강조해주세요
  - "당신은 정말 대단해요", "이런 모습이 정말 멋져요" 같은 격려를 포함해주세요

두 번째 부분 (위로):
  - 사용자의 감정을 깊이 이해하고 공감해주세요
  - "그런 감정을 느끼는 것은 자연스러워요", "당신은 혼자가 아니에요" 같은 위로를 해주세요
  - 사용자의 경험을 정상화하고 안심시켜주세요

세 번째 부분 (해결책):
  - 구체적이고 실용적인 조언을 제공해주세요
  - 단계별 접근 방법을 제시해주세요
  - 반드시 1개 이상의 구체적인 해결책 링크를 포함해주세요
  - 예시: "입맛이 없을 때는 이런 레시피를 시도해보세요: [링크]" 또는 "스트레스 해소에 도움이 되는 명상 앱: [링크]"
  - 웹 검색 결과가 있다면 그것을 참고하여 최신 정보와 유용한 링크를 추천해주세요
  - 전문적인 도움이 필요한 경우 상담사나 전문가 상담을 권장해주세요

각 부분은 최소 3-4문장으로 상세하게 작성해주세요. 번호나 "섹션"이라는 단어를 사용하지 말고 자연스럽게 연결해주세요.`
        },
        {
          role: "user",
          content: message + searchContext
        }
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || '죄송합니다. 답변을 생성할 수 없습니다.';

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('API Error:', error);

    // OpenAI API 할당량 초과 에러 처리
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return NextResponse.json(
        {
          error: 'API 할당량이 부족합니다. 잠시 후 다시 시도해주세요.',
          details: 'OpenAI API 사용량이 초과되었습니다. 새로운 API 키를 발급받거나 잠시 후 다시 시도해주세요.'
        },
        { status: 429 }
      );
    }

    // 기타 OpenAI API 에러
    if (error.status) {
      return NextResponse.json(
        {
          error: 'AI 서비스에 일시적인 문제가 있습니다.',
          details: '잠시 후 다시 시도해주세요.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 