// Azure AD / Microsoft Entra ID Configuration
// Replace placeholder values with actual IDs from Azure App Registration
// Redirect URI must be registered in Azure portal as SPA platform
export const environment = {
  production: true,
  azure: {
    clientId: 'AZURE_CLIENT_ID_PLACEHOLDER',
    tenantId: 'AZURE_TENANT_ID_PLACEHOLDER',
    redirectUri: 'https://your-production-domain.com',
    postLogoutRedirectUri: 'https://your-production-domain.com',
  },
};
