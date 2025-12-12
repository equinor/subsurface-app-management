import { EnvironmentType, EnvironmentToggleFeatures } from 'src/types';
import { ENVIRONMENT_TOGGLE_KEY } from 'src/constants';

// Mock the utils/environment module to avoid window dependency issues
vi.mock('src/utils', () => ({
  environment: {
    getEnvironmentName: (env?: string) => env || 'development',
    getApiUrl: () => 'https://api.test.com',
    getAppName: () => 'test-app',
    getConfig: () => '',
    getApplicationInsightsConnectionString: () => undefined,
  },
}));

// Mock the token functions to avoid API call dependencies
vi.mock('./OpenAPI', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    getSAMToken: vi.fn(async () => 'mock-sam-token'),
  };
});

// Now import after mocks are set up
const { getOpenAPIConfig, getCustomEnvironmentConfig, getFeatureEnvironment } =
  await import('./OpenAPI');

describe('getFeatureEnvironment', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('returns correct EnvironmentType when feature is enabled in localStorage', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;
    const enabledFeatures = [
      { value: feature, label: 'Feature Toggle' },
      { value: 'other-feature', label: 'Other Feature' },
    ];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'development');

    const result = getFeatureEnvironment(feature);

    expect(result).toBe('development');
  });

  test('returns null when feature is not in enabled features list', () => {
    const feature = EnvironmentToggleFeatures.TUTORIAL;
    const enabledFeatures = [
      {
        value: EnvironmentToggleFeatures.FEATURE_TOGGLE,
        label: 'Feature Toggle',
      },
    ];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    const result = getFeatureEnvironment(feature);

    expect(result).toBe(null);
  });

  test('returns null when localStorage is empty', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;

    const result = getFeatureEnvironment(feature);

    expect(result).toBe(null);
  });

  test('handles malformed JSON in localStorage and returns null', () => {
    const feature = EnvironmentToggleFeatures.IMPERSONATE_USER;
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    localStorage.setItem(ENVIRONMENT_TOGGLE_KEY, 'invalid-json-{]');

    const result = getFeatureEnvironment(feature);

    expect(result).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to parse environment toggle value from localStorage:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  test('handles empty array in localStorage', () => {
    const feature = EnvironmentToggleFeatures.TUTORIAL;

    localStorage.setItem(ENVIRONMENT_TOGGLE_KEY, JSON.stringify([]));

    const result = getFeatureEnvironment(feature);

    expect(result).toBe(null);
  });

  test('returns correct environment for different VITE_ENVIRONMENT_NAME values', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;
    const enabledFeatures = [{ value: feature, label: 'Feature Toggle' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    // Test staging environment
    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'staging');
    expect(getFeatureEnvironment(feature)).toBe('staging');

    // Test production environment
    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'production');
    expect(getFeatureEnvironment(feature)).toBe('production');

    // Test localhost environment
    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'localhost');
    expect(getFeatureEnvironment(feature)).toBe('localhost');
  });
});

describe('getCustomEnvironmentConfig', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('returns development environment with getSAMToken when feature environment is localhost', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;
    const enabledFeatures = [{ value: feature, label: 'Feature Toggle' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'localhost');

    const result = getCustomEnvironmentConfig(feature);

    expect(result.environment).toBe(EnvironmentType.DEVELOP);
    expect(typeof result.token).toBe('function');
    expect(result.token?.name).toBe('getSAMToken');
  });

  test('returns production environment with getSAMProdToken when feature environment is null', () => {
    const feature = EnvironmentToggleFeatures.TUTORIAL;

    const result = getCustomEnvironmentConfig(feature);

    expect(result.environment).toBe(EnvironmentType.PRODUCTION);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('function');
  });

  test('returns production environment with getSAMProdToken when feature environment is production', () => {
    const feature = EnvironmentToggleFeatures.FAQ;
    const enabledFeatures = [{ value: feature, label: 'FAQ' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'production');

    const result = getCustomEnvironmentConfig(feature);

    expect(result.environment).toBe(EnvironmentType.PRODUCTION);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('function');
  });

  test('returns development environment with getSAMToken when feature environment is development', () => {
    const feature = EnvironmentToggleFeatures.IMPERSONATE_USER;
    const enabledFeatures = [{ value: feature, label: 'Impersonate User' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'development');

    const result = getCustomEnvironmentConfig(feature);

    expect(result.environment).toBe(EnvironmentType.DEVELOP);
    expect(typeof result.token).toBe('function');
    expect(result.token?.name).toBe('getSAMToken');
  });

  test('returns staging environment with getSAMToken when feature environment is staging', () => {
    const feature = EnvironmentToggleFeatures.TUTORIAL;
    const enabledFeatures = [{ value: feature, label: 'Tutorial' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'staging');

    const result = getCustomEnvironmentConfig(feature);

    expect(result.environment).toBe(EnvironmentType.STAGING);
    expect(typeof result.token).toBe('function');
    expect(result.token?.name).toBe('getSAMToken');
  });

  test('handles feature environment with malformed localStorage', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    localStorage.setItem(ENVIRONMENT_TOGGLE_KEY, 'malformed-json');

    const result = getCustomEnvironmentConfig(feature);

    // Should default to production when parsing fails
    expect(result.environment).toBe(EnvironmentType.PRODUCTION);
    expect(result.token).toBeDefined();

    consoleErrorSpy.mockRestore();
  });
});

describe('getOpenAPIConfig', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('returns correct OpenAPIConfig with production BASE URL when feature is not enabled', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;

    const config = getOpenAPIConfig(feature);

    expect(config).toEqual({
      BASE: 'https://api-sam-backend-production.radix.equinor.com',
      VERSION: '1.0',
      WITH_CREDENTIALS: false,
      CREDENTIALS: 'include',
      TOKEN: expect.any(Function),
      USERNAME: undefined,
      PASSWORD: undefined,
      HEADERS: undefined,
      ENCODE_PATH: undefined,
    });
  });

  test('returns correct OpenAPIConfig with development BASE URL when feature is enabled in development', () => {
    const feature = EnvironmentToggleFeatures.TUTORIAL;
    const enabledFeatures = [{ value: feature, label: 'Tutorial' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'development');

    const config = getOpenAPIConfig(feature);

    expect(config.BASE).toBe(
      'https://api-sam-backend-development.radix.equinor.com'
    );
    expect(config.VERSION).toBe('1.0');
    expect(config.WITH_CREDENTIALS).toBe(false);
    expect(config.CREDENTIALS).toBe('include');
    expect(typeof config.TOKEN).toBe('function');
    expect((config.TOKEN as Function).name).toBe('getSAMToken');
    expect(config.USERNAME).toBeUndefined();
    expect(config.PASSWORD).toBeUndefined();
    expect(config.HEADERS).toBeUndefined();
    expect(config.ENCODE_PATH).toBeUndefined();
  });

  test('returns correct OpenAPIConfig with staging BASE URL when feature is enabled in staging', () => {
    const feature = EnvironmentToggleFeatures.FAQ;
    const enabledFeatures = [{ value: feature, label: 'FAQ' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'staging');

    const config = getOpenAPIConfig(feature);

    expect(config.BASE).toBe(
      'https://api-sam-backend-staging.radix.equinor.com'
    );
    expect(config.VERSION).toBe('1.0');
    expect(config.WITH_CREDENTIALS).toBe(false);
    expect(config.CREDENTIALS).toBe('include');
    expect(typeof config.TOKEN).toBe('function');
    expect((config.TOKEN as Function).name).toBe('getSAMToken');
    expect(config.USERNAME).toBeUndefined();
    expect(config.PASSWORD).toBeUndefined();
    expect(config.HEADERS).toBeUndefined();
    expect(config.ENCODE_PATH).toBeUndefined();
  });

  test('returns development BASE URL when feature is enabled in localhost', () => {
    const feature = EnvironmentToggleFeatures.IMPERSONATE_USER;
    const enabledFeatures = [{ value: feature, label: 'Impersonate User' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'localhost');

    const config = getOpenAPIConfig(feature);

    // Localhost should map to development
    expect(config.BASE).toBe(
      'https://api-sam-backend-development.radix.equinor.com'
    );
    expect(typeof config.TOKEN).toBe('function');
    expect((config.TOKEN as Function).name).toBe('getSAMToken');
  });

  test('returns production BASE URL and token when feature is enabled in production', () => {
    const feature = EnvironmentToggleFeatures.FEATURE_TOGGLE;
    const enabledFeatures = [{ value: feature, label: 'Feature Toggle' }];

    localStorage.setItem(
      ENVIRONMENT_TOGGLE_KEY,
      JSON.stringify(enabledFeatures)
    );

    vi.stubEnv('VITE_ENVIRONMENT_NAME', 'production');

    const config = getOpenAPIConfig(feature);

    expect(config.BASE).toBe(
      'https://api-sam-backend-production.radix.equinor.com'
    );
    expect(config.TOKEN).toBeDefined();
    expect(typeof config.TOKEN).toBe('function');
  });

  test('has correct static properties in OpenAPIConfig', () => {
    const feature = EnvironmentToggleFeatures.TUTORIAL;

    const config = getOpenAPIConfig(feature);

    expect(config.VERSION).toBe('1.0');
    expect(config.WITH_CREDENTIALS).toBe(false);
    expect(config.CREDENTIALS).toBe('include');
    expect(config.USERNAME).toBeUndefined();
    expect(config.PASSWORD).toBeUndefined();
    expect(config.HEADERS).toBeUndefined();
    expect(config.ENCODE_PATH).toBeUndefined();
  });

  test('handles all EnvironmentToggleFeatures enum values', () => {
    const features = [
      EnvironmentToggleFeatures.FEATURE_TOGGLE,
      EnvironmentToggleFeatures.TUTORIAL,
      EnvironmentToggleFeatures.IMPERSONATE_USER,
      EnvironmentToggleFeatures.FAQ,
    ];

    features.forEach((feature) => {
      const config = getOpenAPIConfig(feature);

      expect(config).toBeDefined();
      expect(config.BASE).toContain('https://api-sam-backend-');
      expect(config.BASE).toContain('.radix.equinor.com');
      expect(config.VERSION).toBe('1.0');
      expect(config.TOKEN).toBeDefined();
    });
  });
});
