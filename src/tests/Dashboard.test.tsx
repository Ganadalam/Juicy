import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../store/queryClient';
import Dashboard from '../pages/Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title and category select', () => {
    render(
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Dashboard />
        </QueryClientProvider>
      </RecoilRoot>
    );
    expect(screen.getByText(/추천 결과/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/카테고리/i)).toBeInTheDocument();
  });
});
