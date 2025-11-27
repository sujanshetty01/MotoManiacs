import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CampusPage from '../../pages/CampusPage';
import { BrowserRouter } from 'react-router-dom';
import * as campusService from '../../services/campusService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/campusService');

describe('Campus Registration Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('submits the campus registration form', async () => {
        (campusService.createCampusRegistration as any).mockResolvedValue({ id: '123' });

        const { container } = render(
            <BrowserRouter>
                <CampusPage />
            </BrowserRouter>
        );

        // Fill form
        fireEvent.change(container.querySelector('input[name="collegeName"]')!, { target: { value: 'Test College' } });
        fireEvent.change(container.querySelector('input[name="estimatedMembers"]')!, { target: { value: '50' } });
        fireEvent.change(container.querySelector('input[name="city"]')!, { target: { value: 'Bangalore' } });
        fireEvent.change(container.querySelector('input[name="state"]')!, { target: { value: 'Karnataka' } });
        
        fireEvent.change(container.querySelector('input[name="studentRepName"]')!, { target: { value: 'John Doe' } });
        fireEvent.change(container.querySelector('input[name="studentRepEmail"]')!, { target: { value: 'john@test.edu' } });
        fireEvent.change(container.querySelector('input[name="studentRepPhone"]')!, { target: { value: '9876543210' } });
        
        // Submit
        const submitButton = screen.getByText('Submit Registration');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(campusService.createCampusRegistration).toHaveBeenCalledWith(expect.objectContaining({
                collegeName: 'Test College',
                studentRepName: 'John Doe',
                studentRepEmail: 'john@test.edu'
            }));
            expect(screen.getByText(/Registration Submitted!/i)).toBeInTheDocument();
        });
    });
});
