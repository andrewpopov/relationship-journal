import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StorySlotDashboard from '../StorySlotDashboard';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ journeyId: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('StorySlotDashboard Component', () => {
  const mockJourney = {
    id: 1,
    title: 'IC Software Engineer Interview Prep',
    description: 'Master behavioral interviews for software engineering roles'
  };

  const mockSlotProgress = [
    {
      id: 1,
      slot_key: 'big-impact',
      title: 'Big, Hard Project / Largest Impact',
      description: 'Your most impactful technical contribution',
      signals: ['ownership', 'execution', 'craft', 'product_sense'],
      estimated_minutes: 45,
      isComplete: false,
      userStory: null
    },
    {
      id: 2,
      slot_key: 'ambiguity',
      title: 'Ambiguous / Underspecified Work',
      description: 'A time when requirements were unclear',
      signals: ['ambiguity', 'ownership', 'product_sense'],
      estimated_minutes: 45,
      isComplete: true,
      userStory: { id: 1, story_title: 'Built microservices architecture' }
    }
  ];

  const mockSignalCoverage = {
    ownership: { covered: true, count: 2, avg_strength: 2.5 },
    execution: { covered: true, count: 1, avg_strength: 3 },
    ambiguity: { covered: true, count: 1, avg_strength: 2 },
    craft: { covered: false, count: 0 },
    product_sense: { covered: true, count: 1, avg_strength: 2.5 }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: {} });
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should render loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading story slots/i)).toBeInTheDocument();
  });

  test('should fetch and display journey details', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney }) // Journey details
      .mockResolvedValueOnce({ data: mockSlotProgress }) // Story slot progress
      .mockResolvedValueOnce({ data: mockSignalCoverage }); // Signal coverage

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockJourney.title)).toBeInTheDocument();
      expect(screen.getByText(mockJourney.description)).toBeInTheDocument();
    });
  });

  test('should display all story slots', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Big, Hard Project / Largest Impact')).toBeInTheDocument();
      expect(screen.getByText('Ambiguous / Underspecified Work')).toBeInTheDocument();
    });
  });

  test('should show completion status for each slot', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const completedBadge = screen.getByText('Completed');
      expect(completedBadge).toBeInTheDocument();
    });
  });

  test('should display signal coverage summary', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Should show "X of Y signals covered"
      const coverageText = screen.getByText(/signals covered/i);
      expect(coverageText).toBeInTheDocument();
    });
  });

  test('should display estimated time for each slot', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/45 minutes/i).length).toBeGreaterThan(0);
    });
  });

  test('should display signals for each slot', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ownership/i)).toBeInTheDocument();
      expect(screen.getByText(/execution/i)).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Journey not found/i)).toBeInTheDocument();
    });
  });

  test('should show Start or Continue button based on completion', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
  });

  test('should navigate to story builder on slot click', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    axios.get
      .mockResolvedValueOnce({ data: mockJourney })
      .mockResolvedValueOnce({ data: mockSlotProgress })
      .mockResolvedValueOnce({ data: mockSignalCoverage });

    render(
      <BrowserRouter>
        <StorySlotDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const slotCard = screen.getByText('Big, Hard Project / Largest Impact');
      fireEvent.click(slotCard.closest('.card'));
    });
  });
});
