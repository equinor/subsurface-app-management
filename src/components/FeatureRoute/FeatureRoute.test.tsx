import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { FeatureRoute } from './FeatureRoute';
import { CancelablePromise } from 'src/api';
import { renderWithProviders, screen } from 'src/tests/test-utils';

enum Scenarios {
  WITH_FEATURES_KEY = 'withFeatures',
  WITHOUT_FEATURES_KEY = 'withoutFeatures',
}

vi.mock('src/api/services/FeatureToggleService', () => {
  class FeatureToggleService {
    public static getMyFeatures(): CancelablePromise<unknown> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve([{ uuid: Scenarios.WITH_FEATURES_KEY }]);
        }, 300);
      });
    }
  }
  return { FeatureToggleService };
});

test('Hides FeatureRoute as expected', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/test']}>
      <Routes>
        <Route path="/" element={<p>home</p>} />
        <Route
          path="/test"
          element={
            <FeatureRoute
              element={<div>Test</div>}
              featureUuid={Scenarios.WITHOUT_FEATURES_KEY}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('Shows FeatureRoute as expected', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/test']}>
      <Routes>
        <Route path="/" element={<p>home</p>} />
        <Route
          path="/test"
          element={
            <FeatureRoute
              element={<div>Test</div>}
              featureUuid={Scenarios.WITH_FEATURES_KEY}
              showIfIsLoading
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/test/i)).toBeInTheDocument();
});

test('Shows fallback as expected', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/test']}>
      <Routes>
        <Route path="/" element={<p>home</p>} />
        <Route
          path="/test"
          element={
            <FeatureRoute
              element={<div>Test</div>}
              fallback={<div>Fallback</div>}
              featureUuid={Scenarios.WITHOUT_FEATURES_KEY}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/fallback/i)).toBeInTheDocument();
});

test('Redirects to set path', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/test']}>
      <Routes>
        <Route path="/" element={<p>home</p>} />
        <Route path="/other" element={<p>other</p>} />
        <Route
          path="/test"
          element={
            <FeatureRoute
              element={<div>Test</div>}
              redirectPath="/other"
              featureUuid={Scenarios.WITHOUT_FEATURES_KEY}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/other/i)).toBeInTheDocument();
});
