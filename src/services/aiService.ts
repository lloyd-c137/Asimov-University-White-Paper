const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export async function streamChat(
  messages: ChatMessage[],
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let fullResponse = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine === "" || trimmedLine === "data: [DONE]") {
          continue;
        }

        if (trimmedLine.startsWith("data: ")) {
          try {
            const jsonStr = trimmedLine.slice(6);
            const data = JSON.parse(jsonStr);
            
            if (data.content) {
              fullResponse += data.content;
              callbacks.onToken(data.content);
            }
          } catch {
            continue;
          }
        }
      }
    }

    callbacks.onComplete(fullResponse);
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}

export function createInitialMessages(language: "zh" | "en", userName: string): ChatMessage[] {
  const greeting = language === "zh" 
    ? `${userName}。很高兴认识你。`
    : `${userName}. Nice to meet you.`;
  
  return [
    {
      role: "assistant",
      content: greeting
    }
  ];
}
