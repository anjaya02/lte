// Azure AD / Microsoft Entra ID Configuration
// Replace placeholder values with actual IDs from Azure App Registration
export const environment = {
  production: false,
  azure: {
    clientId: 'AZURE_CLIENT_ID_PLACEHOLDER',
    tenantId: 'AZURE_TENANT_ID_PLACEHOLDER',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
};
