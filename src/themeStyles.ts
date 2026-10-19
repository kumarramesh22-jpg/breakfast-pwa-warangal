// Clean, minimalist neutral palette (No loud or bright colors)
export const themeColors = {
  primarySolid: '#1A202C',      // Deep charcoal/slate for prominent buttons and actions
  secondarySolid: '#4A5568',    // Muted slate for secondary controls or steady states
  interactiveGrey: '#EDF2F7',   // Soft grey for borders, active indicators, and structures
  whatsappGreen: '#25D366',     // Kept only for standard WhatsApp brand compliance
  
  // Clean backgrounds and surfaces
  appBackground: '#F7FAFC',     // Ultra-light clean gray canvas surface
  cardBackground: '#FFFFFF',    // Crisp white for structural layout grids
  borderNeutral: '#E2E8F0',     // Subtle separating borders
  
  // High contrast typography
  textPrimary: '#1A202C',       // Dark graphite for clear readability
  textSecondary: '#4A5568',     // Subdued gray for prices and labels
  textLight: '#FFFFFF',         // White text on dark solid elements
};

// Polished structural layouts for elements, input boxes, and grids
export const sharedUIStyles = {
  // Elegant minimal card with a precise boundary line and subtle resting shadow
  premiumCard: {
    backgroundColor: themeColors.cardBackground,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${themeColors.borderNeutral}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },

  // High-contrast, solid professional buttons
  primaryActionButton: {
    backgroundColor: themeColors.primarySolid,
    color: themeColors.textLight,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontWeight: '600' as const,
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },

  // Standard flat secondary tracking buttons
  secondaryButton: {
    backgroundColor: themeColors.interactiveGrey,
    color: themeColors.textPrimary,
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontWeight: '500' as const,
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  },

  // Balanced minimal form input boxes
  modernInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${themeColors.borderNeutral}`,
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: themeColors.textPrimary,
  },

  // Uniform application structural container layout
  appContainer: {
    padding: '20px',
    maxWidth: '480px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: themeColors.appBackground,
    minHeight: '100vh',
  }
};
// Clean, minimalist neutral palette (No loud or bright colors)
export const themeColors = {
  primarySolid: '#1A202C',      // Deep charcoal/slate for prominent buttons and actions
  secondarySolid: '#4A5568',    // Muted slate for secondary controls or steady states
  interactiveGrey: '#EDF2F7',   // Soft grey for borders, active indicators, and structures
  whatsappGreen: '#25D366',     // Kept only for standard WhatsApp brand compliance
  
  // Clean backgrounds and surfaces
  appBackground: '#F7FAFC',     // Ultra-light clean gray canvas surface
  cardBackground: '#FFFFFF',    // Crisp white for structural layout grids
  borderNeutral: '#E2E8F0',     // Subtle separating borders
  
  // High contrast typography
  textPrimary: '#1A202C',       // Dark graphite for clear readability
  textSecondary: '#4A5568',     // Subdued gray for prices and labels
  textLight: '#FFFFFF',         // White text on dark solid elements
};

// Polished structural layouts for elements, input boxes, and grids
export const sharedUIStyles = {
  // Elegant minimal card with a precise boundary line and subtle resting shadow
  premiumCard: {
    backgroundColor: themeColors.cardBackground,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${themeColors.borderNeutral}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },

  // High-contrast, solid professional buttons
  primaryActionButton: {
    backgroundColor: themeColors.primarySolid,
    color: themeColors.textLight,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontWeight: '600' as const,
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },

  // Standard flat secondary tracking buttons
  secondaryButton: {
    backgroundColor: themeColors.interactiveGrey,
    color: themeColors.textPrimary,
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    fontWeight: '500' as const,
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  },

  // Balanced minimal form input boxes
  modernInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${themeColors.borderNeutral}`,
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: themeColors.textPrimary,
  },

  // Uniform application structural container layout
  appContainer: {
    padding: '20px',
    maxWidth: '480px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: themeColors.appBackground,
    minHeight: '100vh',
  }
};
