import type { ChatMessage, ConversationResponse } from "@/types/chat";
import { CONFIG } from "@/config";
import type { ChatResponse } from "@/types/chat";
import { ChatError, UnauthorizedError } from "./exceptions";

export interface StreamCallbacks {
  onComplete: (message: ChatMessage) => void;
}

export const agentClient = {
  async sendChatMessage(
    userMessage: string,
    conversationId: string
  ): Promise<ChatResponse> {

    const tenant = CONFIG.TENANT;
    const bearerToken = localStorage.getItem("access.token");

    const requestBody = {userMessage: userMessage, conversationId: conversationId, tenant: tenant, bearerToken: bearerToken}
    try {
      const response = await fetch(
      CONFIG.ATRACIO_AGENT_BASE_URL +"/chat",
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
      const chatResponse: ChatResponse = await response.json();
      return chatResponse;
    } catch (error) {
      throw new ChatError("An error occured, please try again !", 500);
    }   
  },

  async getConversationHistory() : Promise<ConversationResponse>{
    try {
      const response = await fetch(
      CONFIG.ATRACIO_AGENT_BASE_URL +"/chat/conversations",
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            },
        });
      const conversationResponse: ConversationResponse = await response.json();
      return conversationResponse;
    } catch (error) {
      throw new ChatError("An error occured, please try again !", 500);
    }   
  },

  async clearConversationHistory(conversationId: string) {
    try {
      const response = await fetch(
      CONFIG.ATRACIO_AGENT_BASE_URL +"/" + conversationId,
          {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json'
            },
        });
      if(response.status === 204) return {success: true};
    } catch (error) {
      throw new ChatError("An error occured, please try again !", 500);
    }   
  },
};
