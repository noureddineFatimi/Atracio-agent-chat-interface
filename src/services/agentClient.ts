import type { ChatMessage, ConversationResponse, ThinkingStep } from "@/types/chat";
import { CONFIG } from "@/config";
import type { ChatResponse } from "@/types/chat";
import { ChatError, UnauthorizedError } from "./exceptions";

interface MockScenario {
  match: RegExp;
  steps: string[];
  response: string;
}

const scenarios: MockScenario[] = [
  {
    match: /purchase order|po\b|supplier|vendor/i,
    steps: [
      "Searching recent purchase orders…",
      "Retrieving supplier information…",
      "Analyzing document lifecycle state…",
      "Preparing ERP response…",
    ],
    response:
      "I found **3 recent purchase orders** for Global Vendor Ltd.\n\n• PO-002145 — €12,400 — *Awaiting approval*\n• PO-002138 — €8,920 — *Received*\n• PO-002130 — €24,100 — *Closed*\n\nWould you like me to release PO-002145 for approval?",
  },
  {
    match: /sales order|so-|client|customer/i,
    steps: [
      "Searching sales orders…",
      "Checking customer records…",
      "Validating order lifecycle…",
      "Preparing summary…",
    ],
    response:
      "Sales order **SO-000101** for *Northwind Logistics* has been released successfully.\n\n• Items: 14\n• Total: €18,750\n• Warehouse: WH-Madrid-01\n• Expected dispatch: in 2 business days",
  },
  {
    match: /stock|inventory|warehouse|article|sku/i,
    steps: [
      "Retrieving inventory data…",
      "Aggregating stock movements…",
      "Cross-checking warehouses…",
      "Preparing final response…",
    ],
    response:
      "Current stock for article **A-100**:\n\n• WH-Madrid-01: **120 units**\n• WH-Barcelona-02: 45 units\n• WH-Valencia-03: 18 units\n\nTotal available: **183 units**. No pending reservations.",
  },
  {
    match: /invoice|billing|payment/i,
    steps: [
      "Searching invoice records…",
      "Checking payment status…",
      "Preparing response…",
    ],
    response:
      "There are **2 outstanding invoices** for this client totaling €9,430. The oldest is 12 days overdue.",
  },
];

const fallback: MockScenario = {
  match: /.*/,
  steps: [
    "Understanding your request…",
    "Searching ERP documents…",
    "Analyzing logistics data…",
    "Preparing response…",
  ],
  response:
    "I can help you with sales orders, purchase orders, vendors, clients, warehouses and stock movements.\n\nTry asking things like:\n• *Show me recent purchase orders from Global Vendor*\n• *What's the stock of article A-100?*\n• *Release sales order SO-000101*",
};

export interface StreamCallbacks {
  onThinking: (steps: ThinkingStep[]) => void;
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

  async getConversationHistory() {
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
};
