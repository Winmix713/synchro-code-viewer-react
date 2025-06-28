
class SecurityService {
  private static instance: SecurityService;
  private cryptoKey: CryptoKey | null = null;

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  async initializeCrypto(): Promise<void> {
    try {
      this.cryptoKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to initialize crypto:', error);
      throw new Error('Failed to initialize encryption');
    }
  }

  async encryptApiKey(apiKey: string): Promise<string> {
    if (!this.cryptoKey) {
      await this.initializeCrypto();
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(apiKey);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        this.cryptoKey!,
        data
      );

      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv, 0);
      combined.set(encryptedArray, iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt API key');
    }
  }

  async decryptApiKey(encryptedApiKey: string): Promise<string> {
    if (!this.cryptoKey) {
      await this.initializeCrypto();
    }

    try {
      const combined = new Uint8Array(
        atob(encryptedApiKey).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        this.cryptoKey!,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt API key');
    }
  }

  validateApiKey(apiKey: string): boolean {
    // Figma API keys start with 'fig' and are typically 40+ characters
    const figmaKeyPattern = /^fig[a-zA-Z0-9_-]{37,}$/;
    return figmaKeyPattern.test(apiKey);
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>'"&]/g, (match) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match] || match;
      });
  }

  generateNonce(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const securityService = SecurityService.getInstance();
