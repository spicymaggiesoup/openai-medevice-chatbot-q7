import type { NextRequest } from "next/server"
import { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"

export const runtime = "nodejs"

let io: SocketIOServer | undefined

export async function GET(req: NextRequest) {
  if (!io) {
    const httpServer = new NetServer()
    io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    io.on("connection", (socket) => {
      console.log("[v0] User connected:", socket.id)

      socket.on("send_message", (data) => {
        console.log("[v0] Message received:", data)

        // Broadcast message to all connected clients
        io?.emit("receive_message", {
          id: Date.now().toString(),
          content: data.content,
          sender: data.sender,
          timestamp: new Date(),
          type: data.type || "text",
        })

        // Simulate bot response for user messages
        if (data.sender === "user") {
          setTimeout(() => {
            const botResponse = generateBotResponse(data.content)
            io?.emit("receive_message", {
              id: (Date.now() + 1).toString(),
              content: botResponse.content,
              sender: "bot",
              timestamp: new Date(),
              type: botResponse.type,
              symptoms: botResponse.symptoms,
            })
          }, 1500)
        }
      })

      socket.on("disconnect", () => {
        console.log("[v0] User disconnected:", socket.id)
      })
    })
  }

  return new Response("Socket.IO server initialized", { status: 200 })
}

function generateBotResponse(userMessage: string) {
  const message = userMessage.toLowerCase()

  if (message.includes("cough") || message.includes("cold")) {
    return {
      content:
        "Coughing can have many causes, such as a cold, flu, or allergies. Are you experiencing any of the following symptoms",
      type: "symptom-check",
      symptoms: ["Sore throat", "Fever", "Shortness of breath"],
    }
  } else if (message.includes("fever") || message.includes("temperature")) {
    return {
      content:
        "Fever can indicate an infection. How long have you been experiencing this? Are you also experiencing any of these symptoms?",
      type: "symptom-check",
      symptoms: ["Headache", "Body aches", "Chills"],
    }
  } else if (message.includes("headache") || message.includes("head")) {
    return {
      content:
        "Headaches can have various causes. Let me help you identify the type. Are you experiencing any of these?",
      type: "symptom-check",
      symptoms: ["Nausea", "Light sensitivity", "Neck stiffness"],
    }
  } else {
    return {
      content:
        "I understand your concern. Can you provide more details about your symptoms so I can better assist you?",
      type: "text",
    }
  }
}
