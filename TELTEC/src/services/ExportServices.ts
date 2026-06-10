import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export class ExportService {
  static async exportToPDF(elementId: string, filename: string) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  }

  static exportToCSV(data: any[], filename: string) {
    try {
      if (!data || data.length === 0) {
        alert('No data to export');
        return;
      }

      // Get headers from the first object
      const headers = Object.keys(data[0]);

      // Create CSV content
      const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            // Handle special characters and commas in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  }

  static exportProjectsReport(projects: any[]) {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Projects Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    const tableData = projects.map(project => [
      project.name,
      project.client,
      project.status,
      new Date(project.deadline).toLocaleDateString(),
      `${project.progress}%`,
      project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'
    ]);

    autoTable(doc, {
      head: [['Project Name', 'Client', 'Status', 'Deadline', 'Progress', 'Budget']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save('projects-report.pdf');
  }

  static exportInventoryReport(inventory: any[]) {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Inventory Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    const tableData = inventory.map(item => [
      item.name,
      item.category,
      `${item.quantity} ${item.unit}`,
      `$${item.price.toFixed(2)}`,
      `$${(item.quantity * item.price).toFixed(2)}`,
      item.supplier,
      new Date(item.lastUpdated).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [['Item Name', 'Category', 'Quantity', 'Unit Price', 'Total Value', 'Supplier', 'Last Updated']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save('inventory-report.pdf');
  }

  static exportMaintenanceReport(maintenance: any[]) {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Maintenance Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    const tableData = maintenance.map(task => [
      task.equipment,
      task.type,
      task.priority,
      task.status,
      new Date(task.scheduledDate).toLocaleDateString(),
      task.assignedTo,
      task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '')
    ]);

    autoTable(doc, {
      head: [['Equipment', 'Type', 'Priority', 'Status', 'Scheduled Date', 'Assigned To', 'Description']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] },
    });

    doc.save('maintenance-report.pdf');
  }
}
