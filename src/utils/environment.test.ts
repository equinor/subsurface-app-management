import { getSamApiUrl } from './environment';

describe('getSamApiUrl', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, '_env_');
  });

  test('defaults to the Radix URL for the SAM environment', () => {
    expect(getSamApiUrl(undefined, 'staging')).toBe(
      'https://api-sam-backend-staging.radix.equinor.com'
    );
  });

  test('replaces {environment} in the override', () => {
    expect(getSamApiUrl('/sam-api/{environment}', 'production')).toBe(
      '/sam-api/production'
    );
  });

  test('uses an override without placeholder as-is', () => {
    expect(getSamApiUrl('http://localhost:5000', 'development')).toBe(
      'http://localhost:5000'
    );
  });

  test('falls back to runtime SAM_API_URL when no override is given', () => {
    Object.assign(window, { _env_: { SAM_API_URL: '/runtime/{environment}' } });

    expect(getSamApiUrl(undefined, 'development')).toBe('/runtime/development');
  });

  test('prefers the override over runtime SAM_API_URL', () => {
    Object.assign(window, { _env_: { SAM_API_URL: '/runtime/{environment}' } });

    expect(getSamApiUrl('/sam-api/{environment}', 'staging')).toBe(
      '/sam-api/staging'
    );
  });
});
