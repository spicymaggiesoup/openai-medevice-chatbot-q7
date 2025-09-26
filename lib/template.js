const chatInterfaceIcons = {
    smile: ["😊", "🙂", "😄", "😃"],
    search: ["🧠", "🔍", "👀"],
    visit: ["👩‍⚕️", "👨‍⚕️"],
};

export const chatInterfaceTemplate = {
    welcome: () => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                `안녕하세요?`,
                `불편한 증상을 말씀해주시면 서초구에서 병원을 찾아드릴게요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                //`안녕하세요? 불편한 증상을 말씀해주세요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                //`서초구에서 병원을 찾아드릴게요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `안녕하세요? 서초구에서 갈 수 있는 병원을 찾아드려요.`,
                `불편한 증상을 말씀해주세요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `안녕하세요! ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                //`안녕하세요! ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                `불편한 증상을 알려주시면 서초구 병원을 찾아드릴게요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `반갑습니다!`,
                //`반갑습니다! ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                `증상을 토대로 서초구 병원을 찾아드릴게요. 증상을 알려주시겠어요? ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
    ],
    evaluating: () => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                `증상 예측 중... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "잠시만 기다려주세요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `열심히 증상을 살펴보고 있어요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "조금만 기다려주세요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `증상을 분석하고 있어요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "잠시만 기다려주세요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `조금만 기다려주세요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "증상을 꼼꼼히 확인 중이에요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `증상 확인 중입니다... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "금방 결과를 알려드릴게요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
    ],
    score_high: (deptnm) => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                "말씀하신 증상으로 예측했을 때",
                `**${deptnm}**에 방문하셔야할 것 같아요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "증상을 살펴본 결과",
                `**${deptnm}** 병원을 내원하셔야할 것 같아요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "확인 결과",
                `**${deptnm}** 진료가 필요할 것 같아요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "예측된 증상에 따라",
                `**${deptnm}** 진료를 권장드려요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "말씀해주신 내용을 바탕으로",
                `**${deptnm}** 방문을 추천드려요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
    ],
    score_low: () => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                "말씀하신 증상만으로는 예측하기가 어려워요.",
                `증상을 더 구체적으로 말씀해주시겠어요? ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "증상을 조금 더 구체적으로 말씀해주시면",
                `보다 정확한 추천이 가능해요! ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "현재 증상만으로는 판단이 어려워요.",
                `조금 더 알려주시겠어요? ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `추가로 증상을 말씀해주시면 더 정확한 예측이 가능해요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                "증상이 조금 더 구체적으로 필요해요.",
                `상세히 알려주실 수 있을까요? ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
    ],
    recommend: (deptnm) => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                `사용자 정보를 기반으로 서초구에서 **${deptnm}**의 진료를 볼 수 있는 병원을 추천해드릴까요?`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 추천해주세요.", "아니요, 괜찮아요."],
            buttonsCallback: [
                () => ``,
                () => ``,
            ],
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `등록된 주소지에서 가장 가까운 **${deptnm}** 서초구 내 병원을 알려드릴까요?`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 알려주세요.", "아니요, 괜찮아요!"],
            buttonsCallback: [
                () => ``,
                () => ``,
            ],
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `서초구 내에서 **${deptnm}** 진료가 가능한 병원을 원하시면 추천해드릴까요?`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 알려주세요.", "아니요, 괜찮아요!"],
            buttonsCallback: [
                () => ``,
                () => ``,
            ],
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `근처에서 **${deptnm}** 진료가 가능한 서초구 내 병원을 찾아드릴게요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 알려주세요.", "아니요, 괜찮아요!"],
            buttonsCallback: [
                () => ``,
                () => ``,
            ],
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `**${deptnm}** 진료를 보실 수 있는 서초구 내 병원 정보를 드릴까요?`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 알려주세요.", "아니요, 괜찮아요!"],
            buttonsCallback: [
                () => ``,
                () => ``,
            ],
        },
    ],
    searching: () => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                `가까운 서초구 병원 찾는 중... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "잠시만 기다려주세요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `열심히 서초구 병원을 찾고 있어요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "조금만 기다려주세요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `추천드릴 서초구 병원을 찾고 있어요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "잠시만 기다려주세요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `조금만 기다려주세요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "가까운 병원을 확인 중이에요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `서초구 병원을 찾는 중입니다... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                "금방 결과를 알려드릴게요.",
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
            nextConnect: true,
        },
    ],
    hospitals: (deptnm, locationList = []) => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                `**${deptnm}** 진료를 볼 수 있는 병원이에요. 🏣`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "mapList",
            location: [].concat(locationList),
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `**${deptnm}** 진료를 받을 수 있는 병원 목록이에요. 🏣`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "mapList",
            location: [].concat(locationList),
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `아래는 **${deptnm}** 진료가 가능한 병원들이에요. 🏣`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "mapList",
            location: [].concat(locationList),
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `**${deptnm}** 진료를 제공하는 병원을 확인해보세요. 🏣`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "mapList",
            location: [].concat(locationList),
        },
    ],
    adios: () => [
        {
            id: (Date.now() + 1).toString(),
            content: [
                `서초구 병원검색 서비스를 이용해주셔서 감사해요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                `불편한 증상이 생기면 또 찾아주세요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `감사합니다. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                `다음에도 서초구 병원 검색은 MeDevise을 찾아주세요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `서비스 이용 감사합니다. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                `서초구 병원 검색은 언제든 도와드릴게요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                `오늘도 건강한 하루 되세요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                `서초구 병원 검색이 필요할 땐 언제든 다시 찾아주세요.`,
            ],
            message_type: "BOT",
            timestamp: new Date(),
            type: "text",
        },
    ],
}

export const diagnosiServiceTemplate = {
  "id_1": {
    "disease_nm": "간염",
    "diagnosis": ["피로", "식욕부진", "황달", "구역질"]
  },
  "id_2": {
    "disease_nm": "골다공증",
    "diagnosis": ["허리 통증", "쉽게 골절", "키 감소", "척추 후만"]
  },
  "id_3": {
    "disease_nm": "치매",
    "diagnosis": ["기억력 감퇴", "언어장애", "길 잃기", "성격 변화"]
  },
  "id_4": {
    "disease_nm": "퇴행성근골격계질환",
    "diagnosis": ["관절통", "운동 제한", "근력 약화", "관절 변형"]
  },
  "id_5": {
    "disease_nm": "당뇨병",
    "diagnosis": ["다뇨", "다음", "다식", "체중 감소"]
  },
  "id_6": {
    "disease_nm": "동맥경화",
    "diagnosis": ["흉통", "어지럼증", "팔다리 저림", "호흡곤란"]
  },
  "id_7": {
    "disease_nm": "신장병",
    "diagnosis": ["부종", "소변량 감소", "피로", "고혈압"]
  },
  "id_11": {
    "disease_nm": "노인성빈혈",
    "diagnosis": ["창백", "피로", "호흡곤란", "어지럼증"]
  },
  "id_12": {
    "disease_nm": "노인성우울증",
    "diagnosis": ["우울감", "무기력", "수면장애", "식욕부진"]
  },
  "id_13": {
    "disease_nm": "뇌동맥류",
    "diagnosis": ["두통", "시력 저하", "구토", "경련"]
  },
  "id_19": {
    "disease_nm": "통풍",
    "diagnosis": ["발가락 관절 통증", "붓기", "열감", "관절 운동 제한"]
  },
  "id_15": {
    "disease_nm": "고혈압",
    "diagnosis": ["두통", "어지럼증", "흉부 압박감", "시야 흐림"]
  },
  "id_16": {
    "disease_nm": "뇌졸중",
    "diagnosis": ["편측 마비", "언어장애", "시야 이상", "어지럼증"]
  },
  "id_17": {
    "disease_nm": "파킨슨병",
    "diagnosis": ["손 떨림", "근육 경직", "동작 느려짐", "보행 이상"]
  },
  "id_8": {
    "disease_nm": "요통",
    "diagnosis": ["허리 통증", "하체 방사통", "운동 제한", "근육 긴장"]
  },
  "id_9": {
    "disease_nm": "류마티스 관절염",
    "diagnosis": ["관절통", "조조강직", "관절 부종", "피로"]
  },
  "id_10": {
    "disease_nm": "위장병",
    "diagnosis": ["속쓰림", "소화불량", "구토", "복통"]
  },
  "id_21": {
    "disease_nm": "갑상선기능항진증",
    "diagnosis": ["체중 감소", "손 떨림", "심계항진", "불면"]
  },
  "id_18": {
    "disease_nm": "오십견",
    "diagnosis": ["어깨 통증", "어깨 운동 제한", "야간 통증", "강직"]
  },
  "id_14": {
    "disease_nm": "변비",
    "diagnosis": ["배변 횟수 감소", "딱딱한 변", "복부 팽만", "배변 곤란"]
  },
  "id_20": {
    "disease_nm": "녹내장",
    "diagnosis": ["시야 결손", "시력 저하", "안압 상승", "두통"]
  }
};

export const chatInterfaceScenario = [];
