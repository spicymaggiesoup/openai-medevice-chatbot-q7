const chatInterfaceIcons = {
    smile: ["😊", "🙂", "😄", "😃"],
    search: ["🧠", "🔍", "👀"],
    visit: ["👩‍⚕️", "👨‍⚕️"],
};

export const chatInterfaceTemplate = {
    welcome: [
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => `안녕하세요? 불편한 증상을 말씀해주세요. ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
                () => `서초구에서 병원을 찾아드릴게요.`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => `안녕하세요. 저는 서초구 내 병원을 찾을 수 있도록 도와드려요.`,
                () => `불편한 증상을 말씀해주시겠어요?  ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
    ],
    evaluating: [
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => `증상 예측 중... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                () => "잠시만 기다려주세요.",
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => `열심히 증상을 살펴보고 있어요... ${chatInterfaceIcons.search[Math.floor(Math.random() * (chatInterfaceIcons.search.length))]}`,
                () => "조금만 기다려주세요.",
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
    ],
    high_eval: [
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => "말씀하신 증상으로 예측했을 때",
                (deptnm = "ophthalmology") => `${deptnm}에 방문하셔야할 것 같아요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => "증상을 살펴본 결과,",
                (deptnm) => `${deptnm} 병원을 내원하셔야할 것 같아요. ${chatInterfaceIcons.visit[Math.floor(Math.random() * (chatInterfaceIcons.visit.length))]}`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
    ],
    low_eval: [
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => "말씀하신 증상만으로는 예측하기가 어려워요.",
                () => `증상을 더 구체적으로 말씀해주시겠어요? ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                () => "증상을 조금 더 구체적으로 말씀해주시면",
                () => `보다 정확한 추천이 가능해요! ${chatInterfaceIcons.smile[Math.floor(Math.random() * (chatInterfaceIcons.smile.length))]}`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
    ],
    recommend: [
        {
            id: (Date.now() + 1).toString(),
            content: [
                (deptnm) => `사용자 정보를 기반으로 ${deptnm}의 진료를 볼 수 있는 병원을 추천해드릴까요?`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 추천해주세요.", "아니요, 괜찮아요."],
        },
        {
            id: (Date.now() + 1).toString(),
            content: [
                (deptnm) => `등록된 주소지에서 가장 가까운 ${deptnm} 병원을 알려드릴까요?`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "button-check",
            buttons: ["네, 알려주세요.", "아니요, 괜찮아요!"],
        },
    ],
    hospitals: [
        {
            id: (Date.now() + 1).toString(),
            content: [
                (deptnm) => `${deptnm} 진료를 볼 수 있는 병원이에요. 🏣`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
        },
        /*{
            id: (Date.now() + 1).toString(),
            content: [
                (deptnm) => `${}`,
            ],
            sender: "bot",
            timestamp: new Date(),
            type: "text",
            buttons: ["네, 알려주세요.", "아니요, 괜찮아요!"],
        },*/
    ],
}

export const chatInterfaceScenario = [];

export const messageScenario = {
  user: [],
  bot: {
    symptoms: {
      Q: [

      ],
      A: [
        // {
        //   id: (Date.now() + 1).toString(),
        //   content: "불편한 증상을 구체적으로 말씀해주시면, 질병에 맞는 병원을 추천드릴게요. 😊",
        //   sender: "bot",
        //   timestamp: new Date(),
        //   type: "text",
        // },
        {
          id: (Date.now() + 1).toString(),
          content: ["말씀하신 증상을 예측해볼게요."],
          sender: "bot",
          timestamp: new Date(),
          type: "button-check",
          buttons: ["예측하기"],
        },
        {
          id: (Date.now() + 1).toString(),
          content: ["말씀하신 증상으로 예측했을 때...", "'진료과'에 방문하셔야할 것 같아요."],
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
        {
          id: (Date.now() + 1).toString(),
          content: ["사용자 정보를 기반으로", "'진료과'의 진료를 볼 수 있는 병원을 추천해드릴까요?"],
          sender: "bot",
          timestamp: new Date(),
          type: "button-check",
          buttons: ["네, 추천해주세요.", "아니요, 괜찮아요."],
        },
        {
          id: (Date.now() + 1).toString(),
          content: ["또 불편한 증상이 있을 때, 말씀해주세요."],
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
        {
          id: (Date.now() + 1).toString(),
          content: ["언제든 가야할 병원을 바로 추천해 드릴게요. 🙌"],
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ],
    },
    search: {
      Q: [
        {
          id: (Date.now() + 1).toString(),
          content: ["'진료과'를 볼 수 있는 병원 목록이에요. 🏥", "👉박창수안과의원"],
          sender: "bot",
          timestamp: new Date(),
          type: "map",
          location: [],
        },
      ],
      A: [
        {
          id: (Date.now() + 1).toString(),
          content: ["네, 알겠습니다.😊", "또 불편한 부분이 있으면 말씀해주세요."],
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        },
      ],
    },
  },
}