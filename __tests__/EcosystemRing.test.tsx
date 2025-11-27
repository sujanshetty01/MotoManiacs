import React from 'react';
import { render, screen } from '@testing-library/react';
import EcosystemRing from '../components/EcosystemRing';
import { EcosystemSegment } from '../types';
import { describe, it, expect } from 'vitest';

describe('EcosystemRing', () => {
    const mockSegments: EcosystemSegment[] = [
        { id: '1', title: 'Segment 1', shortDescription: 'Desc 1', iconName: 'icon1', order: 0 },
        { id: '2', title: 'Segment 2', shortDescription: 'Desc 2', iconName: 'icon2', order: 1 },
    ];

    it('renders the central hub', () => {
        render(<EcosystemRing segments={mockSegments} />);
        expect(screen.getByText('MOTO')).toBeInTheDocument();
        expect(screen.getByText('MANIACS')).toBeInTheDocument();
    });

    it('renders all segments', () => {
        render(<EcosystemRing segments={mockSegments} />);
        expect(screen.getByText('Segment 1')).toBeInTheDocument();
        expect(screen.getByText('Segment 2')).toBeInTheDocument();
        expect(screen.getByText('Desc 1')).toBeInTheDocument();
        expect(screen.getByText('Desc 2')).toBeInTheDocument();
    });
});
