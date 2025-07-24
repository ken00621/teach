import { useState } from 'react';
import { useHistory } from './useHistory';

interface FeedbackData {
  correct: string;
  mistakes: string;
  advice: string;
  accuracy: number;
  clarity: number;
}

const TOPICS_BY_SUBJECT = {
  '数学': [
    "一次関数とは？",
    "二次方程式の解き方とは？",
    "三角比の基本とは？",
    "確率の計算方法とは？"
  ],
  '理科': [
    "食物連鎖とは？",
    "細胞分裂とは何か？",
    "慣性の法則について説明せよ。",
    "光合成の仕組みとは？",
    "酸化と還元とは？"
  ],
  '社会': [
    "鎌倉幕府の特徴とは？",
    "明治維新とは何か？",
    "GDPとは何か？",
    "三権分立とは？"
  ],
  '環境・地理': [
    "SDGsの意味と目的とは？",
    "地震と津波の関係とは？",
    "天気と気候の違いは？",
    "持続可能なエネルギーとは？",
    "地球温暖化の原因とは？"
  ]
};

const ALL_TOPICS = Object.values(TOPICS_BY_SUBJECT).flat();

const TOPIC_ANSWERS: { [key: string]: string } = {
  "一次関数とは？": "一次関数とは、y = ax + b（a ≠ 0）の形で表される関数です。aは傾きを表し、bはy切片を表します。グラフは直線になり、xの値が1増加するとyの値はa増加します。例えば、y = 2x + 3では、傾きが2、y切片が3の直線となります。",
  
  "二次方程式の解き方とは？": "二次方程式ax² + bx + c = 0（a ≠ 0）の解き方には、因数分解、解の公式、平方完成があります。解の公式は x = (-b ± √(b²-4ac)) / 2a です。判別式D = b²-4acにより、D > 0なら異なる2つの実数解、D = 0なら重解、D < 0なら実数解なしとなります。",
  
  "三角比の基本とは？": "三角比とは、直角三角形において角と辺の比を表したものです。sinθ = 対辺/斜辺、cosθ = 隣辺/斜辺、tanθ = 対辺/隣辺で定義されます。特別な角（30°、45°、60°）の三角比の値は重要で、様々な計算で使用されます。",
  
  "確率の計算方法とは？": "確率とは、ある事象が起こる可能性を数値で表したものです。確率 = 事象が起こる場合の数 / 全ての場合の数 で計算します。0 ≤ P ≤ 1の範囲で、0は絶対起こらない、1は必ず起こることを意味します。独立事象の同時確率は各確率の積で求められます。",
  
  "食物連鎖とは？": "食物連鎖とは、生態系において生物が「食べる・食べられる」の関係でつながっている仕組みです。植物（生産者）→草食動物（一次消費者）→肉食動物（二次消費者）→より大きな肉食動物（三次消費者）という順序で、エネルギーと栄養が移動します。最終的に分解者（細菌など）がすべてを分解し、栄養を土壌に戻します。",
  
  "光合成の仕組みとは？": "光合成とは、植物が光エネルギーを使って二酸化炭素と水から有機物（ブドウ糖）を作る反応です。化学式は 6CO₂ + 6H₂O + 光エネルギー → C₆H₁₂O₆ + 6O₂ です。葉緑体のクロロフィルが光を吸収し、明反応と暗反応（カルビン回路）の2段階で進行します。",
  
  "酸化と還元とは？": "酸化とは物質が酸素と結合する、または電子を失う反応です。還元とは酸素を失う、または電子を得る反応です。酸化と還元は必ず同時に起こり（酸化還元反応）、一方が酸化されると他方が還元されます。例：2Mg + O₂ → 2MgO（Mgが酸化、O₂が還元）",
  
  "鎌倉幕府の特徴とは？": "鎌倉幕府（1185-1333年）は、源頼朝が開いた日本初の武家政権です。主な特徴は：①将軍を頂点とする武士による政治、②守護・地頭制度による地方統治、③御家人制度による主従関係、④朝廷と並存する二重政治構造です。京都の朝廷が形式的権威を保ちながら、実際の政治は鎌倉で行われました。",
  
  "明治維新とは何か？": "明治維新とは、1868年頃から始まった日本の近代化改革です。江戸幕府が倒れ、天皇中心の新政府が成立しました。廃藩置県、身分制度の廃止、文明開化、富国強兵政策などにより、封建社会から近代国家への転換を図りました。西洋の技術や制度を積極的に取り入れ、急速な近代化を実現しました。",
  
  "三権分立とは？": "三権分立とは、国家権力を立法権（国会）、行政権（内閣）、司法権（裁判所）の3つに分け、相互に監視・牽制させる制度です。権力の集中を防ぎ、独裁を防止する民主主義の基本原理です。日本国憲法でも採用されており、国民の権利と自由を守る重要な仕組みです。",
  
  "慣性の法則について説明せよ。": "慣性の法則（ニュートンの第一法則）とは、「物体は外力が働かない限り、静止している物体は静止し続け、運動している物体は等速直線運動を続ける」という法則です。例えば、電車が急ブレーキをかけると乗客が前に倒れるのは、乗客の体が等速直線運動を続けようとするためです。この性質を慣性といいます。",
  
  "細胞分裂とは何か？": "細胞分裂とは、1つの細胞が2つ以上の細胞に分かれる現象です。主に体細胞分裂と減数分裂があります。体細胞分裂では、DNA複製後に染色体が均等に分配され、遺伝的に同じ2つの細胞ができます。これにより生物の成長や組織の修復が行われます。減数分裂は生殖細胞形成時に起こり、染色体数が半分になります。",
  
  "SDGsの意味と目的とは？": "SDGs（Sustainable Development Goals）とは、2015年に国連で採択された「持続可能な開発目標」です。2030年までに達成すべき17の目標からなり、「誰一人取り残さない」社会の実現を目指します。貧困撲滅、教育、環境保護、平和など幅広い分野をカバーし、先進国・途上国すべてが取り組む普遍的な目標です。",
  
  "地震と津波の関係とは？": "地震と津波は密接に関係しています。海底で大きな地震が発生すると、プレートの急激な動きにより海底が隆起・沈降し、大量の海水が押し上げられます。この海水の変動が波となって四方八方に伝播するのが津波です。津波は通常の波と異なり、波長が長く、沿岸部で高さが急激に増大する特徴があります。",
  
  "天気と気候の違いは？": "天気とは、ある場所の短期間（数時間から数日）の大気の状態を指し、気温、湿度、降水、風などで表されます。一方、気候とは、ある地域の長期間（通常30年以上）の天気の平均的な傾向を指します。例えば「今日は雨」は天気、「日本は温帯気候」は気候の話です。天気は変わりやすく、気候は安定しています。",
  
  "GDPとは何か？": "GDP（Gross Domestic Product：国内総生産）とは、一定期間内に国内で生産されたすべての財・サービスの付加価値の合計です。国の経済規模や豊かさを測る重要な指標で、消費、投資、政府支出、純輸出の合計で計算されます。GDPが増加すると経済成長、減少すると経済縮小を意味します。",
  
  "持続可能なエネルギーとは？": "持続可能なエネルギーとは、将来世代のニーズを損なうことなく現在のエネルギー需要を満たすエネルギーです。主に再生可能エネルギー（太陽光、風力、水力、地熱、バイオマス）を指します。化石燃料と異なり枯渇せず、CO2排出量が少ないため環境負荷が小さく、長期的に安定供給が可能な特徴があります。",
  
  "地球温暖化の原因とは？": "地球温暖化の主な原因は、人間活動による温室効果ガス（CO₂、メタン、フロンなど）の増加です。特に化石燃料の燃焼によるCO₂排出が最大の要因です。これらのガスが大気中で熱を吸収し、地球の平均気温を上昇させています。森林伐採による CO₂吸収能力の低下も温暖化を加速させています。"
};
export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('全教科');
  const { addHistoryEntry } = useHistory();

  const generateRandomTopic = (subject?: string) => {
    const subjectToUse = subject || selectedSubject;
    let availableTopics: string[];
    
    if (subjectToUse === '全教科') {
      availableTopics = ALL_TOPICS;
    } else {
      availableTopics = TOPICS_BY_SUBJECT[subjectToUse] || ALL_TOPICS;
    }
    
    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    const topic = availableTopics[randomIndex];
    setCurrentTopic(topic);
    return topic;
  };

  const getCorrectAnswer = (topic: string): string => {
    return TOPIC_ANSWERS[topic] || '';
  };
  const analyzeFeedback = (text: string): FeedbackData => {
    // Parse the AI response to extract structured feedback
    const sections = {
      correct: '',
      mistakes: '',
      advice: '',
      accuracy: 3,
      clarity: 3
    };

    // Extract sections using regex patterns
    const correctMatch = text.match(/✅[^❌💡📊]*/);
    const mistakeMatch = text.match(/❌[^✅💡📊]*/);
    const adviceMatch = text.match(/💡[^✅❌📊]*/);
    const scoreMatch = text.match(/📊.*?(\d)[^0-9]*?(\d)/);

    if (correctMatch) {
      sections.correct = correctMatch[0].replace('✅', '').trim();
    }

    if (mistakeMatch) {
      sections.mistakes = mistakeMatch[0].replace('❌', '').trim();
    }

    if (adviceMatch) {
      sections.advice = adviceMatch[0].replace('💡', '').trim();
    }

    if (scoreMatch) {
      sections.accuracy = parseInt(scoreMatch[1]) || 3;
      sections.clarity = parseInt(scoreMatch[2]) || 3;
    }

    return sections;
  };

  const submitExplanation = async (explanation: string, topic?: string, mode: 'random' | 'custom' = 'random') => {
    if (!explanation.trim()) {
      setError('説明文を入力してください');
      return;
    }

    const topicToUse = topic || currentTopic;
    if (!topicToUse) {
      setError('テーマが設定されていません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate AI response (in a real app, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI response based on the explanation
      const mockResponse = generateMockFeedback(explanation, topicToUse);
      const parsedFeedback = analyzeFeedback(mockResponse);
      
      setFeedback(parsedFeedback);
      
      // Add to history
      addHistoryEntry(topicToUse, explanation, parsedFeedback, mode);
    } catch (err) {
      setError('フィードバックの生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const generateMockFeedback = (explanation: string, topic: string): string => {
    // Generate realistic feedback based on explanation content
    const wordCount = explanation.split(' ').length;
    const hasExamples = explanation.includes('例えば') || explanation.includes('たとえば');
    const hasConclusion = explanation.includes('つまり') || explanation.includes('したがって');
    
    let accuracy = Math.min(5, Math.max(2, Math.floor(wordCount / 20) + 2));
    let clarity = hasExamples && hasConclusion ? 5 : hasExamples || hasConclusion ? 4 : 3;

    // Topic-specific feedback adjustments
    const topicKeywords = getTopicKeywords(topic);
    const hasRelevantKeywords = topicKeywords.some(keyword => 
      explanation.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasRelevantKeywords) {
      accuracy = Math.min(5, accuracy + 1);
    }
    return `✅正しい点：
お題「${topic}」に対して基本的な概念を理解できており、自分の言葉で表現しようとする姿勢が素晴らしいです。${hasExamples ? '具体例を使って説明している点も良いですね。' : ''}${hasRelevantKeywords ? '重要なキーワードを適切に使用できています。' : ''}

❌間違いや不明瞭な点：
${wordCount < 30 ? '説明がやや簡潔すぎて、詳細が不足している部分があります。' : ''}${!hasConclusion ? '結論や要点のまとめがあるとより理解しやすくなります。' : ''}${!hasRelevantKeywords ? 'このお題に関連する専門用語をもう少し使用すると良いでしょう。' : ''}

💡改善アドバイス：
${!hasExamples ? '具体例や身近な例を加えると、より理解しやすい説明になります。' : ''}構造化された説明（序論・本論・結論）を意識すると、聞き手により伝わりやすくなるでしょう。「${topic}」について説明する際は、${getTopicAdvice(topic)}

📊評価スコア：
正確さ: ${accuracy}/5
わかりやすさ: ${clarity}/5`;
  };

  const getTopicKeywords = (topic: string): string[] => {
    const keywordMap: { [key: string]: string[] } = {
      '一次関数': ['傾き', 'y切片', 'グラフ', '比例'],
      '二次方程式': ['解の公式', '因数分解', '判別式', '平方完成'],
      '三角比': ['sin', 'cos', 'tan', '直角三角形'],
      '確率': ['場合の数', '事象', '独立', '排反'],
      '食物連鎖': ['生産者', '消費者', '分解者', '生態系'],
      '光合成': ['クロロフィル', '葉緑体', '二酸化炭素', '酸素'],
      '酸化': ['電子', '還元', '酸素', '化学反応'],
      '鎌倉幕府': ['源頼朝', '武士', '守護', '地頭'],
      '明治維新': ['廃藩置県', '文明開化', '富国強兵', '近代化'],
      '三権分立': ['立法', '行政', '司法', '権力'],
      '慣性の法則': ['ニュートン', '第一法則', '静止', '等速直線運動'],
      '細胞分裂': ['DNA', '染色体', '体細胞分裂', '減数分裂'],
      'SDGs': ['持続可能', '開発目標', '国連', '2030年'],
      '地震': ['プレート', '震源', 'マグニチュード', '震度'],
      '天気': ['気象', '短期間', '局地的', '変化'],
      'GDP': ['国内総生産', '経済指標', '付加価値', '国の豊かさ'],
      '持続可能': ['再生可能', '環境', '将来世代', '循環'],
      '地球温暖化': ['温室効果ガス', 'CO₂', '化石燃料', '気候変動']
    };
    
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (topic.includes(key)) {
        return keywords;
      }
    }
    return [];
  };

  const getTopicAdvice = (topic: string): string => {
    const adviceMap: { [key: string]: string } = {
      '一次関数': '数式とグラフの関係を明確に説明することが重要です。',
      '二次方程式': '解法の手順を段階的に示し、判別式の意味も説明しましょう。',
      '三角比': '直角三角形での定義から始めて、具体的な角度での値も示すと良いでしょう。',
      '確率': '具体例を使って計算過程を示すと理解しやすくなります。',
      '食物連鎖': '各段階の役割と相互関係を具体的に示すと良いでしょう。',
      '光合成': '化学式と反応の場所（葉緑体）を明確に説明してください。',
      '酸化': '電子の移動という観点から説明すると理解が深まります。',
      '鎌倉幕府': '時代背景と政治制度の特徴を関連付けて説明してください。',
      '明治維新': '社会制度の変化を具体例とともに説明すると効果的です。',
      '三権分立': '各権力の役割と相互の関係を明確に示しましょう。',
      '慣性の法則': '日常生活の具体例を使って法則を説明すると理解しやすくなります。',
      '細胞分裂': '過程を段階的に説明し、その意義も含めると良いでしょう。',
      'SDGs': '17の目標の中から具体例を挙げて説明すると効果的です。',
      '地震': '発生メカニズムと被害の関係を明確に説明してください。',
      '天気': '気候との違いを明確にし、変化の要因も説明しましょう。',
      'GDP': '計算方法や他の経済指標との違いも触れると良いでしょう。',
      '持続可能': '具体的な取り組み例を挙げて説明すると理解が深まります。',
      '地球温暖化': '原因と影響を具体的なデータとともに説明しましょう。'
    };
    
    for (const [key, advice] of Object.entries(adviceMap)) {
      if (topic.includes(key)) {
        return advice;
      }
    }
    return '関連する専門用語を適切に使用し、具体例を交えて説明してください。';
  };
  const clearFeedback = () => {
    setFeedback(null);
    setError(null);
  };

  return {
    loading,
    feedback,
    error,
    currentTopic,
    selectedSubject,
    setSelectedSubject,
    availableSubjects: ['全教科', ...Object.keys(TOPICS_BY_SUBJECT)],
    generateRandomTopic,
    getCorrectAnswer,
    submitExplanation,
    clearFeedback
  };
};