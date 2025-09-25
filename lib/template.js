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

export const chatInterfaceScenario = [];
