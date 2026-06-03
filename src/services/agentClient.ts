import type { ChatMessage, ConversationResponse } from "@/types/chat";
import { CONFIG } from "@/config";
import type { ChatResponse } from "@/types/chat";
import { ChatError, ShouldLoginError, UnauthorizedError } from "./exceptions";
import { atracioAuthClient } from "./atracioAuthClient";
import { useNavigate } from "@tanstack/react-router";

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
      if (chatResponse.requiresTokenRefresh === true) {
        localStorage.removeItem("access.token");
        const result = await atracioAuthClient.tryRefreshToken();
        if (result.success) {
           return this.sendChatMessage(userMessage, conversationId);
        } else {
          throw new ShouldLoginError("You should login Again", 401);
        }
      } else {
        return chatResponse;
      }
    } catch (error) {
      if (error instanceof ShouldLoginError) {
        throw error;
      }
      throw new ChatError(
        "An error occured, please try again !",
        500
      );
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
      CONFIG.ATRACIO_AGENT_BASE_URL +"/chat/" + conversationId,
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
