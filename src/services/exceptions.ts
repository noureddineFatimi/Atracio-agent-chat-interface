export class ChatError extends Error {
  public errorCode: number;

  constructor(message: string, errorCode: number) {
    super(message); // Appel du constructeur de la classe mère
    this.name = "ChatError"; // Définition du nom de l'erreur
    this.errorCode = errorCode;

    // Cette ligne est cruciale pour que 'instanceof' fonctionne correctement après la compilation
    Object.setPrototypeOf(this, ChatError.prototype);
  }
}

export class UnauthorizedError extends Error {
  public errorCode: number;

  constructor(message: string, errorCode: number) {
    super(message); // Appel du constructeur de la classe mère
    this.name = "UnauthorizedError"; // Définition du nom de l'erreur
    this.errorCode = errorCode;

    // Cette ligne est cruciale pour que 'instanceof' fonctionne correctement après la compilation
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ShouldLoginError extends Error {
  public errorCode: number;

  constructor(message: string, errorCode: number) {
    super(message); // Appel du constructeur de la classe mère
    this.name = "ShouldLoginError"; // Définition du nom de l'erreur
    this.errorCode = errorCode;

    // Cette ligne est cruciale pour que 'instanceof' fonctionne correctement après la compilation
    Object.setPrototypeOf(this, ShouldLoginError.prototype);
  }
}