/**
 * Smart Deep Links Handler
 * Intelligently routes deep links based on app state and user authentication
 */

export interface DeepLinkConfig {
  path: string;
  requiresAuth: boolean;
  fallback?: string;
  handler?: (params: Record<string, string>) => void;
}

export interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  issueType: string;
  source: string;
  timestamp: string;
  userAgent: string;
  sessionId: string;
  context: Record<string, any>;
}

export class DeepLinkManager {
  private deepLinks: Map<string, DeepLinkConfig> = new Map();
  private isAuthenticated: boolean = false;
  private sessionId: string;
  private currentUser: any = null;
  private navigationCallback: ((path: string) => void) | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.registerDefaultLinks();
  }

  /**
   * Set navigation callback for React Router integration
   */
  setNavigationCallback(callback: (path: string) => void): void {
    this.navigationCallback = callback;
  }

  /**
   * Generate unique session ID for tracking
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set current user for support context
   */
  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  /**
   * Get device and context information
   */
  private getDeviceContext(): Record<string, any> {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer
    };
  }

  /**
   * Handle support request with rich context
   */
  private handleSupportRequest(params: Record<string, string>): void {
    if (!this.currentUser) {
      console.warn('No user context available for support request');
      return;
    }

    const supportRequest: SupportRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: this.currentUser.id || 'unknown',
      userName: this.currentUser.name || 'Anonymous',
      issueType: params.issueType || 'general',
      source: params.source || 'app',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      context: {
        ...this.getDeviceContext(),
        page: window.location.pathname,
        queryParams: params,
        userProfile: {
          name: this.currentUser.name,
          age: this.currentUser.age,
          location: this.currentUser.residence,
          city: this.currentUser.city,
          state: this.currentUser.state,
          tags: this.currentUser.tags
        }
      }
    };

    // Log support request for analytics
    console.log('Support Request:', supportRequest);

    // Generate Telegram link with context
    const telegramLink = this.generateTelegramSupportLink(supportRequest);
    
    // Open Telegram in new tab
    window.open(telegramLink, '_blank');
  }

  /**
   * Generate Telegram support link with rich context
   */
  private generateTelegramSupportLink(request: SupportRequest): string {
    const context = JSON.stringify(request, null, 2);
    const message = `🤖 Support Request Logged

🆔 Request ID: ${request.id}
👤 User: ${request.userName} (${request.userId})
📱 Issue: ${request.issueType.toUpperCase()}
📍 Source: ${request.source}
⏰ Time: ${request.timestamp}
🔧 Session: ${request.sessionId}

📊 Context:
${context}

Please assist with this request.`;

    return `https://t.me/+5n1XeNZl39VkYzU0?text=${encodeURIComponent(message)}`;
  }

  /**
   * Register default deep links for the app
   */
  private registerDefaultLinks(): void {
    // Profile deep links
    this.register({
      path: '/user/:id',
      requiresAuth: true,
      fallback: '/login'
    });

    // Hotel deep links
    this.register({
      path: '/hotel/:hotelId',
      requiresAuth: true,
      fallback: '/login'
    });

    // Community deep links
    this.register({
      path: '/community/:communityId',
      requiresAuth: true,
      fallback: '/login'
    });

    // Messages deep links
    this.register({
      path: '/messages/:conversationId',
      requiresAuth: true,
      fallback: '/login'
    });

    // VIP deep links
    this.register({
      path: '/vip',
      requiresAuth: true,
      fallback: '/login'
    });

    // Home
    this.register({
      path: '/',
      requiresAuth: true,
      fallback: '/login'
    });

    // Login (no auth required)
    this.register({
      path: '/login',
      requiresAuth: false
    });

    // Support deep links - scalable system
    this.register({
      path: '/support/:issueType',
      requiresAuth: false,
      handler: (params) => this.handleSupportRequest({
        issueType: params.issueType,
        source: 'deep_link'
      })
    });

    // Support from specific pages
    this.register({
      path: '/support/:issueType/:source',
      requiresAuth: false,
      handler: (params) => this.handleSupportRequest({
        issueType: params.issueType,
        source: params.source
      })
    });

    // QR code support
    this.register({
      path: '/support/qr/:issueType',
      requiresAuth: false,
      handler: (params) => this.handleSupportRequest({
        issueType: params.issueType,
        source: 'qr_code'
      })
    });
  }

  /**
   * Register a deep link route
   */
  register(config: DeepLinkConfig): void {
    this.deepLinks.set(config.path, config);
  }

  /**
   * Set authentication state
   */
  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticated = isAuthenticated;
  }

  /**
   * Parse URL parameters from path
   */
  private parseParams(pattern: string, path: string): Record<string, string> | null {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1);
        params[paramName] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return params;
  }

  /**
   * Find matching deep link config for a path
   */
  private findMatchingConfig(path: string): { config: DeepLinkConfig; params: Record<string, string> } | null {
    for (const [pattern, config] of this.deepLinks.entries()) {
      const params = this.parseParams(pattern, path);
      if (params !== null) {
        return { config, params };
      }
    }
    return null;
  }

  /**
   * Handle a deep link intelligently
   * Routes based on:
   * 1. Authentication state
   * 2. Route requirements
   * 3. Fallback routes
   */
  handleDeepLink(url: string): string {
    try {
      // Parse URL and extract path
      const urlObj = new URL(url, window.location.origin);
      let path = urlObj.pathname + urlObj.hash;

      // Remove leading hash if present
      if (path.startsWith('#')) {
        path = path.slice(1);
      }

      // Clean up path
      if (!path.startsWith('/')) {
        path = '/' + path;
      }

      console.log('🔍 Handling deep link:', { url, path, authenticated: this.isAuthenticated });

      const match = this.findMatchingConfig(path);

      if (!match) {
        // Route not found, redirect to home or login
        const fallback = this.isAuthenticated ? '/' : '/login';
        console.log('⚠️ No matching route for:', path, '→ Fallback to:', fallback);
        return fallback;
      }

      const { config, params } = match;

      // Check authentication requirements
      if (config.requiresAuth && !this.isAuthenticated) {
        // User not authenticated, use fallback or redirect to login
        const fallback = config.fallback || '/login';
        console.log('🔐 Route requires auth, user not authenticated →', fallback);
        return fallback;
      }

      console.log('✅ Deep link matched:', { path, params });

      // Call custom handler if provided
      if (config.handler) {
        console.log('⚙️ Executing custom handler for:', path);
        config.handler(params);
      }

      // Navigate if callback is registered
      if (this.navigationCallback) {
        console.log('🚀 Calling navigation callback for:', path);
        this.navigationCallback(path);
      }

      // Return the resolved path
      return path;
    } catch (error) {
      console.error('❌ Error handling deep link:', error);
      return this.isAuthenticated ? '/' : '/login';
    }
  }

  /**
   * Check if a deep link requires authentication
   */
  requiresAuth(path: string): boolean {
    const match = this.findMatchingConfig(path);
    return match ? match.config.requiresAuth : false;
  }

  /**
   * Get all registered deep link patterns
   */
  getRegisteredLinks(): string[] {
    return Array.from(this.deepLinks.keys());
  }

  /**
   * Generate a deep link for sharing
   */
  generateShareLink(path: string, params?: Record<string, string>): string {
    let link = path;

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        link = link.replace(`:${key}`, value);
      }
    }

    // Return absolute URL with hash
    return `${window.location.origin}/#${link}`;
  }
}

// Create singleton instance
let deepLinkManager: DeepLinkManager | null = null;

/**
 * Get the deep link manager instance
 */
export function getDeepLinkManager(): DeepLinkManager {
  if (!deepLinkManager) {
    deepLinkManager = new DeepLinkManager();
  }
  return deepLinkManager;
}

/**
 * Handle incoming deep link
 */
export function handleDeepLink(url: string): string {
  return getDeepLinkManager().handleDeepLink(url);
}

/**
 * Generate support deep link for any component
 */
export function generateSupportLink(issueType: string, source: string = 'app'): string {
  const manager = getDeepLinkManager();
  return manager.generateShareLink(`/support/${issueType}/${source}`);
}

/**
 * Quick support button helper
 */
export function triggerSupport(issueType: string, source: string = 'app'): void {
  const manager = getDeepLinkManager();
  manager.handleDeepLink(`/support/${issueType}/${source}`);
}

/**
 * Set current user for support context
 */
export function setSupportUser(user: any): void {
  const manager = getDeepLinkManager();
  manager.setCurrentUser(user);
}

/**
 * Initialize deep link handling with authentication state
 */
export function initializeDeepLinks(isAuthenticated: boolean, navigationCallback?: (path: string) => void): void {
  const manager = getDeepLinkManager();
  manager.setAuthenticated(isAuthenticated);

  // Set navigation callback for React Router integration
  if (navigationCallback) {
    manager.setNavigationCallback(navigationCallback);
  }

  // Log initialization
  console.log('📍 Deep Links Initialized:', {
    authenticated: isAuthenticated,
    registeredLinks: manager.getRegisteredLinks(),
    currentPath: window.location.pathname + window.location.hash
  });

  // Handle initial deep link on page load
  const hash = window.location.hash;
  if (hash && hash !== '#/') {
    // Clean hash
    const path = hash.startsWith('#') ? hash.slice(1) : hash;
    console.log('🔗 Processing initial deep link:', path);
    handleDeepLink(window.location.origin + '/#' + path);
  }

  // Listen for deep link events (for web, this is manual)
  // For mobile (Capacitor), listen to App.appUrlOpen event
  if ((window as any).Capacitor) {
    const { App } = (window as any).Capacitor;
    App?.addListener('appUrlOpen', (event: any) => {
      console.log('📱 Capacitor deep link event:', event.url);
      const path = handleDeepLink(event.url);
      window.location.hash = path;
    });
  }
}
