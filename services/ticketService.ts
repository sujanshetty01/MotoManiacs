import { Booking, Event } from '../types';
import QRCodeLib from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a QR code data URL for the booking ID
 */
const generateQRCodeDataURL = async (bookingId: string): Promise<string> => {
  try {
    return await QRCodeLib.toDataURL(bookingId, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

/**
 * Generates a ticket HTML content
 */
const generateTicketHTML = async (booking: Booking, event: Event): Promise<string> => {
  const eventDate = new Date(event.date);
  const bookingDate = new Date(booking.bookingDate);
  const bookingId = String(booking.id || 'booking').substring(0, 8).toUpperCase();
  
  // Format dates
  const formattedEventDate = eventDate.toLocaleString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedBookingDate = bookingDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
  
  // Get event image
  const eventImage = event.images && event.images.length > 0 
    ? event.images[0] 
    : 'https://picsum.photos/seed/fallback/800/600';
  
  // Escape HTML to prevent XSS
  const escapeHtml = (text: any): string => {
    // Convert to string and handle null/undefined
    if (text == null) return '';
    const textStr = String(text);
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return textStr.replace(/[&<>"']/g, (m) => map[m]);
  };
  
  const safeEventTitle = escapeHtml(event.title);
  const safeVenue = escapeHtml(event.venue);
  const safeDuration = escapeHtml(event.duration);
  const safeUserName = escapeHtml(booking.userName);
  const safeUserEmail = escapeHtml(booking.userEmail);
  const safePhone = booking.phone ? escapeHtml(booking.phone) : '';
  const safeStatus = escapeHtml(booking.status);

  // Generate QR code data URL
  const qrDataUrl = await generateQRCodeDataURL(booking.id);
  const qrCodeHTML = qrDataUrl 
    ? `<img src="${qrDataUrl}" alt="QR Code for Booking ${bookingId}" style="width: 180px; height: 180px; display: block;">`
    : `<div class="qr-placeholder">Booking ID<br>${bookingId}</div>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket - ${safeEventTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .ticket-container {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            max-width: 800px;
            width: 100%;
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }
        
        .ticket-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%);
        }
        
        .ticket-content {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 0;
            min-height: 500px;
        }
        
        .ticket-main {
            padding: 50px 45px;
            position: relative;
        }
        
        .event-image-section {
            margin-bottom: 35px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .event-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        
        .ticket-qr-section {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            padding: 50px 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 280px;
            position: relative;
        }
        
        .ticket-qr-section::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 1px;
            background: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.1) 10px,
                rgba(255, 255, 255, 0.1) 20px
            );
        }
        
        .event-title {
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 8px;
            line-height: 1.2;
            letter-spacing: -0.5px;
        }
        
        .event-subtitle {
            font-size: 13px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 40px;
        }
        
        .ticket-details {
            display: grid;
            gap: 28px;
            margin-bottom: 40px;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .detail-label {
            font-size: 11px;
            font-weight: 600;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }
        
        .detail-value {
            font-size: 16px;
            font-weight: 500;
            color: #1e293b;
            line-height: 1.4;
        }
        
        .detail-value-large {
            font-size: 20px;
            font-weight: 600;
            color: #1e3a8a;
        }
        
        .booking-id-section {
            margin-top: 35px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
        }
        
        .booking-id-display {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            letter-spacing: 3px;
            text-align: center;
            padding: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }
        
        .qr-code-wrapper {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        
        .qr-code-wrapper img {
            display: block;
            width: 180px;
            height: 180px;
        }
        
        .qr-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-align: center;
            margin-top: 15px;
        }
        
        .ticket-footer {
            background: #f8fafc;
            padding: 25px 45px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
        }
        
        .ticket-footer-text {
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.6;
        }
        
        .ticket-footer-text strong {
            color: #64748b;
            font-weight: 600;
        }
        
        .qr-placeholder {
            width: 180px;
            height: 180px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px dashed rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            text-align: center;
            padding: 15px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .ticket-container {
                box-shadow: none;
                border: 1px solid #e2e8f0;
                max-width: 100%;
                page-break-inside: avoid;
            }
            
            .ticket-content {
                display: grid;
                grid-template-columns: 1fr auto;
            }
            
            @page {
                margin: 0;
                size: A4 portrait;
            }
        }
        
        @media (max-width: 768px) {
            .ticket-content {
                grid-template-columns: 1fr;
            }
            
            .ticket-qr-section {
                min-width: 100%;
                padding: 40px;
            }
            
            .ticket-qr-section::before {
                display: none;
            }
            
            .ticket-main {
                padding: 40px 30px;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-content">
            <div class="ticket-main">
                <div class="event-image-section">
                    <img src="${eventImage}" alt="${safeEventTitle}" class="event-image" onerror="this.src='https://picsum.photos/seed/fallback/800/600'">
                </div>
                
                <h1 class="event-title">${safeEventTitle}</h1>
                <div class="event-subtitle">Event Ticket</div>
                
                <div class="ticket-details">
                    <div class="detail-item">
                        <div class="detail-label">Booking ID</div>
                        <div class="detail-value-large">${bookingId}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Date & Time</div>
                        <div class="detail-value">${formattedEventDate}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Venue</div>
                        <div class="detail-value">${safeVenue}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-label">Seat Number</div>
                        <div class="detail-value">General Admission (${booking.tickets} ${booking.tickets === 1 ? 'Ticket' : 'Tickets'})</div>
                    </div>
                </div>
                
                <div class="booking-id-section">
                    <div class="detail-label" style="margin-bottom: 8px;">Booking Reference</div>
                    <div class="booking-id-display">${booking.id}</div>
                </div>
            </div>
            
            <div class="ticket-qr-section">
                <div class="qr-code-wrapper">
                    ${qrCodeHTML}
                </div>
                <div class="qr-label">Scan for Entry</div>
            </div>
        </div>
        
        <div class="ticket-footer">
            <p class="ticket-footer-text">
                <strong>Important:</strong> Please present this ticket at the venue entrance.<br>
                Keep this ticket safe and do not share it with others.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Downloads a ticket as PDF by opening a print dialog
 */
export const downloadTicket = async (booking: Booking, event: Event): Promise<void> => {
  try {
    const ticketHTML = await generateTicketHTML(booking, event);
    
    // Create a blob from the HTML
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in a new window
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      // Wait for the window to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Clean up the URL after a delay
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
        }, 250);
      };
    } else {
      // Fallback: if popup is blocked, create a download link
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = String(event.title || 'event').replace(/\s+/g, '-');
      const safeBookingId = String(booking.id || 'booking').substring(0, 8);
      link.download = `ticket-${safeTitle}-${safeBookingId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }
  } catch (error) {
    console.error('Error generating ticket:', error);
    alert('Failed to generate ticket. Please try again.');
  }
};

/**
 * Alternative: Downloads ticket as HTML file
 */
export const downloadTicketAsHTML = async (booking: Booking, event: Event): Promise<void> => {
  try {
    const ticketHTML = await generateTicketHTML(booking, event);
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${event.title.replace(/\s+/g, '-')}-${booking.id.substring(0, 8)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading ticket:', error);
    alert('Failed to download ticket. Please try again.');
  }
};

/**
 * Downloads a ticket as PDF using html2canvas and jsPDF
 */
export const downloadTicketAsPDF = async (booking: Booking, event: Event): Promise<void> => {
  try {
    // Generate the ticket HTML
    const ticketHTML = await generateTicketHTML(booking, event);
    
    // Create a temporary container to render the HTML
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '600px';
    tempContainer.innerHTML = ticketHTML;
    document.body.appendChild(tempContainer);
    
    // Wait for images to load
    const images = tempContainer.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if image fails
        }
      });
    });
    
    await Promise.all(imagePromises);
    
    // Wait a bit more for QR code to render if it's an image
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert HTML to canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 600,
      windowWidth: 600,
    });
    
    // Remove temporary container
    document.body.removeChild(tempContainer);
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgWidthFinal = imgWidth * ratio;
    const imgHeightFinal = imgHeight * ratio;
    
    // Center the image
    const xOffset = (pdfWidth - imgWidthFinal) / 2;
    const yOffset = (pdfHeight - imgHeightFinal) / 2;
    
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidthFinal, imgHeightFinal);
    
    // Generate filename with safe string conversion
    const safeTitle = String(event.title || 'event').replace(/\s+/g, '-');
    const safeBookingId = String(booking.id || 'booking').substring(0, 8);
    const filename = `ticket-${safeTitle}-${safeBookingId}.pdf`;
    
    // Download PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again or use the HTML download option.');
  }
};

