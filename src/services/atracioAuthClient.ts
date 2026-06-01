import { CONFIG } from "@/config";
import type { AuthSession } from "@/types/auth";
import { Unauthorized } from "@/types/unauthorized";
import { useNavigate } from "@tanstack/react-router";

const ACCESS_TOKEN_KEY = "access.token";

export const atracioAuthClient = {
  async login(email: string, password: string, rememberMe: boolean) {
    const crendentials = {email: email, password: password, rememberMe: rememberMe, loginTier: "internal"}
    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(crendentials)
    });
    if(response.ok) {
      const token: AuthSession = await response.json();
      localStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
      return {success: true, errorMessage: "Authentified"};
    } else {
      if (response.status == 401) {
        const errorMessage: Unauthorized = await response.json();
        return {success: false, errorMessage: errorMessage.message};
      } else {
        return {success: false, errorMessage: "An error occurred, Please try again"};
      }
    }
  } 
}
