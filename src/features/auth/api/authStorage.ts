import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'collection_auth_token';

export function getStoredAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export function storeAuthToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function clearStoredAuthToken(): Promise<void> {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}
