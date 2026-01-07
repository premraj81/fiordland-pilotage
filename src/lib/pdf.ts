import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { LOGO_BASE64, SIG_CLEAVER_BASE64 } from './pdf_assets';

export const generatePDF = (checklistData: any, schema: any, outputType: 'save' | 'blob' | 'datauristring' = 'save') => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    // Helper to draw a checkbox
    const drawCheckbox = (x: number, y: number, checked: boolean) => {
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, 5, 5, 'FD'); // 5x5mm box
        if (checked) {
            doc.setFontSize(14);
            doc.text('X', x + 1, y + 4);
        }
    };

    // --- PAGE 1: Fiordland Passage Plan Checklist ---

    // Header
    try {
        doc.addImage(LOGO_BASE64, 'JPEG', 15, 10, 32, 30); // Larger and vertically stretched
    } catch (e) {
        console.warn("Could not add logo", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Fiordland Passage Plan Checklist", 100, 20, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Date:", 100, 35);
    const dateStr = checklistData.date ? format(new Date(checklistData.date), 'dd/MM/yyyy') : '';
    doc.text(dateStr, 120, 35);
    doc.setDrawColor(150);
    doc.line(118, 36, 190, 36); // Dotted line effect (solid for now)

    let currentY = 50;

    // Vessel Details
    doc.setFontSize(11);
    doc.text("Vessel name:", 15, currentY);
    doc.text(checklistData.data.header?.vesselName || '', 50, currentY);
    doc.line(48, currentY + 1, 140, currentY + 1); // Line underneath
    currentY += 8;

    // Planned Route is a checkbox section in formatting but we have it as text/chips.
    // In the image it says "Planned route: ...................."
    // We will list the selected routes.
    doc.text("Planned route:", 15, currentY);
    const routes = checklistData.data.header?.plannedRoute || [];
    const routeText = Array.isArray(routes) ? routes.join(', ') : (routes || '');
    doc.text(routeText, 50, currentY);
    doc.line(48, currentY + 1, 190, currentY + 1);
    currentY += 15;

    // Sections
    // We will loop specifically through expected sections to match the form order
    // Order: Vessel elements, Navigation elements, BRM elements, Briefings

    const renderChecklistSection = (sectionId: string, title?: string) => {
        const section = schema.sections.find((s: any) => s.id === sectionId);
        if (!section) return;

        if (title) {
            doc.setFont("helvetica", "bold");
            doc.text(title, 15, currentY);
            currentY += 8;
        }

        doc.setFont("helvetica", "normal");
        section.items?.forEach((item: string, idx: number) => {
            const isChecked = checklistData.data[sectionId]?.[`item-${idx}`];
            drawCheckbox(20, currentY - 4, !!isChecked);
            doc.text(item, 35, currentY);
            currentY += 7;
        });
        currentY += 5; // Spacing after section
    };

    renderChecklistSection('vessel-elements', 'Vessel elements');
    renderChecklistSection('navigation-elements', 'Navigation elements');
    renderChecklistSection('brm-elements', 'BRM elements');

    // Briefings completed for each fiord (Horizontal layout)
    const briefingsSection = schema.sections.find((s: any) => s.id === 'briefings');
    if (briefingsSection) {
        doc.setFont("helvetica", "bold");
        doc.text("Briefings completed for each fiord", 15, currentY);
        currentY += 10;

        doc.setFont("helvetica", "normal");
        // Defined positions to handle longer names and spacing
        const positions = [25, 70, 125, 175];

        briefingsSection.items.forEach((item: string, idx: number) => {
            const isChecked = checklistData.data['briefings']?.[`item-${idx}`];
            const x = positions[idx] || (30 + (idx * 45));

            // Box
            drawCheckbox(x, currentY, !!isChecked);

            // Text wrapped to 40mm to prevent overlap
            doc.setFontSize(10);
            const splitText = doc.splitTextToSize(item, 42);
            doc.text(splitText, x, currentY + 10);
        });
        currentY += 25; // Space for the next part
    }

    // Page 1 Signatures (Master / Pilot)
    // Moved down to avoid overlap with top section
    const sigY = pageHeight - 33;
    const sigGap = 12; // Reduced gap

    doc.setFont("helvetica", "bold");
    doc.text("Master:", 15, sigY);
    doc.line(35, sigY, 180, sigY);

    doc.setFont("helvetica", "normal");
    doc.text(checklistData.names?.master || '', 40, sigY - 2);

    if (checklistData.signatures?.['Master']) {
        try { doc.addImage(checklistData.signatures['Master'], 'PNG', 100, sigY - 12, 40, 12); } catch (e) { }
    }

    doc.setFont("helvetica", "bold");
    doc.text("Pilot:", 15, sigY + sigGap);
    doc.line(35, sigY + sigGap, 180, sigY + sigGap);

    doc.setFont("helvetica", "normal");
    doc.text(checklistData.names?.pilot || '', 40, sigY + sigGap - 2);

    if (checklistData.signatures?.['Pilot']) {
        try { doc.addImage(checklistData.signatures['Pilot'], 'PNG', 100, sigY + sigGap - 12, 40, 12); } catch (e) { }
    }

    if (checklistData.showTrainee) {
        doc.setFont("helvetica", "bold");
        doc.text("Trainee:", 15, sigY + (sigGap * 2));
        doc.line(35, sigY + (sigGap * 2), 180, sigY + (sigGap * 2));

        doc.setFont("helvetica", "normal");
        doc.text(checklistData.names?.trainee || '', 40, sigY + (sigGap * 2) - 2);

        if (checklistData.signatures?.['Trainee']) {
            try { doc.addImage(checklistData.signatures['Trainee'], 'PNG', 100, sigY + (sigGap * 2) - 12, 40, 12); } catch (e) { }
        }
    }


    // --- PAGE 2: Pre-Entry Checklist ---
    doc.addPage();

    try {
        doc.addImage(LOGO_BASE64, 'JPEG', 15, 10, 32, 30);
    } catch (e) { }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    // Moved down further to ensure no overlap
    doc.text("Fiordland Pilot's Pre-Entry Checklist", 105, 45, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    currentY = 60;

    const preEntrySection = schema.finalSections?.find((s: any) => s.id === 'pre-entry');

    if (preEntrySection) {
        doc.text("This Pre-Entry Checklist forms part of the pilot's Passage Plan Checklist for Fiordland.", 15, currentY);
        currentY += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Entry into any of the Fiords is not to be attempted if any of the below navigational factors are", 15, currentY);
        currentY += 5;
        doc.text("present.", 15, currentY);
        doc.setFont("helvetica", "normal");
        currentY += 15;

        // Checkboxes
        preEntrySection.items.forEach((item: string, idx: number) => {
            const isChecked = checklistData.data['pre-entry']?.[`item-${idx}`]; // Checked means PRESENT/Forbidden typically
            drawCheckbox(20, currentY - 4, !!isChecked);

            // Text can be long, split it
            const splitText = doc.splitTextToSize(item, 150);
            doc.text(splitText, 35, currentY);
            currentY += (splitText.length * 6) + 6;
        });
    }

    currentY += 20;

    // Pilot Signature Page 2
    doc.text("Pilot:", 15, currentY);
    doc.line(30, currentY, 150, currentY);

    const finalPilotSig = checklistData.signatures?.['Pilot (Pre-Entry)'] || checklistData.signatures?.['Pilot'];
    if (finalPilotSig) {
        try { doc.addImage(finalPilotSig, 'PNG', 40, currentY - 12, 40, 12); } catch (e) { }
    }

    // Static Bottom Signature (Lyndon Cleaver)
    const bottomY = pageHeight - 35;
    try {
        doc.addImage(SIG_CLEAVER_BASE64, 'JPEG', 15, bottomY, 70, 25);
    } catch (e) { }


    // Output
    if (outputType === 'datauristring') {
        return doc.output('datauristring');
    } else if (outputType === 'blob') {
        return doc.output('blob');
    } else {
        doc.save(`fiordland-pilotage-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
    }
};
