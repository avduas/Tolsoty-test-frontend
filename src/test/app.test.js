import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders the initial UI correctly', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter URL 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter URL 2')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter URL 3')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('updates URL input fields correctly', () => {
    render(<App />);
    const input1 = screen.getByPlaceholderText('Enter URL 1');
    fireEvent.change(input1, { target: { value: 'https://example.com' } });
    expect(input1.value).toBe('https://example.com');
  });

  test('displays an error message when less than 3 URLs are entered', () => {
    render(<App />);
    const input1 = screen.getByPlaceholderText('Enter URL 1');
    fireEvent.change(input1, { target: { value: 'https://example.com' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter at least 3 URLs.')).toBeInTheDocument();
  });

  test('fetches and displays metadata on successful submission', async () => {
    const mockResponse = [
      { title: 'Title 1', description: 'Description 1', image: 'image1.jpg' },
      { title: 'Title 2', description: 'Description 2', image: 'image2.jpg' },
      { title: 'Title 3', description: 'Description 3', image: 'image3.jpg' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://example1.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://example2.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://example3.com' } });

    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Title 1')).toBeInTheDocument();
    expect(await screen.findByText('Description 1')).toBeInTheDocument();
    expect(screen.getByAltText('Title 1')).toHaveAttribute('src', 'image1.jpg');

    expect(await screen.findByText('Title 2')).toBeInTheDocument();
    expect(await screen.findByText('Description 2')).toBeInTheDocument();
    expect(screen.getByAltText('Title 2')).toHaveAttribute('src', 'image2.jpg');

    expect(await screen.findByText('Title 3')).toBeInTheDocument();
    expect(await screen.findByText('Description 3')).toBeInTheDocument();
    expect(screen.getByAltText('Title 3')).toHaveAttribute('src', 'image3.jpg');
  });

  test('displays an error message on failed submission', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to fetch metadata' }),
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://example1.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://example2.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://example3.com' } });

    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Failed to fetch metadata')).toBeInTheDocument();
  });
});
