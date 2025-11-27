import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuickBook from '../components/QuickBook';
import * as availabilityService from '../services/availabilityService';
import { useAppContext } from '../hooks/useAppContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock services and hooks
vi.mock('../services/availabilityService');
vi.mock('../hooks/useAppContext');

describe('QuickBook', () => {
    const mockSlots = [
        {
            id: '1',
            date: '2023-11-01',
            timeSlot: '10:00 AM',
            price: 100,
            available: 5,
            capacity: 10,
            booked: 5,
            vehicleType: 'Car',
            trackLocation: 'Track A'
        }
    ];

    const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        role: 'user'
    };

    beforeEach(() => {
        (availabilityService.getAvailableSlots as any).mockResolvedValue(mockSlots);
        (availabilityService.getSlotsByEventId as any).mockResolvedValue(mockSlots);
        (useAppContext as any).mockReturnValue({ currentUser: mockUser });
    });

    it('renders slots', async () => {
        render(<QuickBook />);
        await waitFor(() => {
            expect(screen.getByText('10:00 AM')).toBeInTheDocument();
        });
    });

    it('allows booking a slot', async () => {
        render(<QuickBook />);
        await waitFor(() => {
            expect(screen.getByText('10:00 AM')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('10:00 AM'));
        
        // Fill form
        fireEvent.change(screen.getByPlaceholderText('+1 (555) 000-0000'), { target: { value: '1234567890' } });
        
        fireEvent.click(screen.getByText('Confirm Booking'));

        await waitFor(() => {
            expect(availabilityService.createQuickBooking).toHaveBeenCalled();
        });
    });
});
