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
  const bookingId = booking.id.substring(0, 8).toUpperCase();
  
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
  const escapeHtml = (text: string): string => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
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
    ? `<img src="${qrDataUrl}" alt="QR Code for Booking ${bookingId}" style="width: 150px; height: 150px; border: 2px solid #e5e7eb; border-radius: 10px; padding: 10px; background: white;">`
    : `<div class="qr-placeholder">Booking ID<br>${bookingId}</div>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket - ${safeEventTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .ticket-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        
        .ticket-header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }
        
        .ticket-header::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 30px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 0 10px white;
        }
        
        .ticket-header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .ticket-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .ticket-body {
            padding: 40px 30px;
        }
        
        .event-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .event-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .ticket-info {
            display: grid;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .info-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 14px;
        }
        
        .info-value {
            font-weight: bold;
            color: #1f2937;
            font-size: 14px;
            text-align: right;
        }
        
        .booking-id {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
        }
        
        .booking-id-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
        }
        
        .booking-id-value {
            font-size: 18px;
            font-weight: bold;
            color: #dc2626;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }
        
        .ticket-footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 2px dashed #e5e7eb;
        }
        
        .ticket-footer p {
            font-size: 12px;
            color: #6b7280;
            line-height: 1.6;
        }
        
        .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            padding: 10px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .ticket-container {
                box-shadow: none;
                max-width: 100%;
            }
            
            @page {
                margin: 0;
                size: A4 portrait;
            }
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-confirmed {
            background: #10b981;
            color: white;
        }
        
        .status-cancelled {
            background: #ef4444;
            color: white;
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-header">
            <h1>MotoManiacs</h1>
            <p>Event Ticket</p>
        </div>
        
        <div class="ticket-body">
            <img src="${eventImage}" alt="${safeEventTitle}" class="event-image" onerror="this.src='https://picsum.photos/seed/fallback/800/600'">
            
            <h2 class="event-title">${safeEventTitle}</h2>
            
            <div class="ticket-info">
                <div class="info-row">
                    <span class="info-label">Date & Time</span>
                    <span class="info-value">${formattedEventDate}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Venue</span>
                    <span class="info-value">${safeVenue}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Event Type</span>
                    <span class="info-value">${event.type}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Duration</span>
                    <span class="info-value">${safeDuration}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Number of Tickets</span>
                    <span class="info-value">${booking.tickets}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Total Price</span>
                    <span class="info-value">$${booking.totalPrice.toFixed(2)}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Status</span>
                    <span class="info-value">
                        <span class="status-badge status-${booking.status.toLowerCase()}">${safeStatus}</span>
                    </span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Booked By</span>
                    <span class="info-value">${safeUserName}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value">${safeUserEmail}</span>
                </div>
                
                ${booking.phone ? `
                <div class="info-row">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${safePhone}</span>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label">Booking Date</span>
                    <span class="info-value">${formattedBookingDate}</span>
                </div>
            </div>
            
            <div class="qr-code-container" style="text-align: center; margin: 20px auto;">
                ${qrCodeHTML}
            </div>
            
            <div class="booking-id">
                <div class="booking-id-label">Booking Reference</div>
                <div class="booking-id-value">${bookingId}</div>
            </div>
        </div>
        
        <div class="ticket-footer">
            <p>
                <strong>Important:</strong> Please present this ticket at the venue entrance.<br>
                Keep this ticket safe and do not share it with others.<br>
                For any queries, contact us at support@motomaniacs.com
            </p>
        </div>
    </div>
    
    <script>
        // Auto-print when page loads (optional)
        // window.onload = function() {
        //     window.print();
        // };
    </script>
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
      link.download = `ticket-${event.title.replace(/\s+/g, '-')}-${booking.id.substring(0, 8)}.html`;
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
    
    // Generate filename
    const filename = `ticket-${event.title.replace(/\s+/g, '-')}-${booking.id.substring(0, 8)}.pdf`;
    
    // Download PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again or use the HTML download option.');
  }
};

