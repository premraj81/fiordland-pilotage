import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { LOGO_BASE64, SIG_CLEAVER_BASE64 } from './pdf_assets';

export const generatePDF = (checklistData: any, schema: any, outputType: 'save' | 'blob' | 'datauristring' = 'save') => {
    if (schema.sections?.some((s: any) => s.type === 'grading')) {
        return generatePeerReviewPDF(checklistData, schema, outputType);
    }
    return generatePassagePlanPDF(checklistData, schema, outputType);
};

const generatePeerReviewPDF = (checklistData: any, schema: any, outputType: 'save' | 'blob' | 'datauristring') => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    try {
        doc.addImage(LOGO_BASE64, 'JPEG', 15, 10, 25, 25);
    } catch (e) { }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Fiordland Pilot Service", pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Pilot Assessment Peer Review", pageWidth / 2, 28, { align: 'center' });

    let currentY = 40;

    // Header Fields (Grid Layout)
    const headerSection = schema.sections.find((s: any) => s.id === 'header');
    if (headerSection) {
        doc.setFontSize(10);
        doc.setDrawColor(0);

        // Custom fixed layout for header to match image
        const fields = checklistData.data.header || {};

        // Row 1: Trainee | Vessel
        doc.rect(15, currentY, 90, 8); // Box 1
        doc.rect(105, currentY, 90, 8); // Box 2
        doc.setFont("helvetica", "bold");
        doc.text("Trainee Pilot / Pilot:", 17, currentY + 5);
        doc.text("Vessel:", 107, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.trainee || '', 60, currentY + 5);
        doc.text(fields.vesselName || '', 130, currentY + 5);
        currentY += 8;

        // Row 2: Pilotage Area | GRT/LOA
        doc.rect(15, currentY, 90, 8);
        doc.rect(105, currentY, 90, 8);
        doc.setFont("helvetica", "bold");
        doc.text("Pilotage area:", 17, currentY + 5);
        doc.text("GRT/LOA:", 107, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.area || '', 60, currentY + 5);
        doc.text(fields.grt_loa || '', 130, currentY + 5);
        currentY += 8;

        // Row 3: Assessor | Master
        doc.rect(15, currentY, 90, 8);
        doc.rect(105, currentY, 90, 8);
        doc.setFont("helvetica", "bold");
        doc.text("Assessor:", 17, currentY + 5);
        doc.text("Master:", 107, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.assessor || '', 60, currentY + 5);
        doc.text(fields.master_name || '', 130, currentY + 5);
        currentY += 8;

        // Row 4: Qualified Pilot | Date
        doc.rect(15, currentY, 90, 8);
        doc.rect(105, currentY, 90, 8);
        doc.setFont("helvetica", "bold");
        doc.text("Qualified Fiordland Pilot:", 17, currentY + 5);
        doc.text("Date:", 107, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.qualified_pilot || '', 60, currentY + 5);
        const dateStr = checklistData.date ? format(new Date(checklistData.date), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy');
        doc.text(dateStr, 130, currentY + 5);
        currentY += 8;

        // Row 5: Weather
        doc.rect(15, currentY, 180, 8);
        doc.setFont("helvetica", "bold");
        doc.text("Weather", 17, currentY + 5);

        doc.text("Sea:", 40, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.wx_sea || '', 50, currentY + 5);

        doc.setFont("helvetica", "bold");
        doc.text("Swell:", 80, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.wx_swell || '', 92, currentY + 5);

        doc.setFont("helvetica", "bold");
        doc.text("Wind:", 120, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.wx_wind || '', 132, currentY + 5);

        doc.setFont("helvetica", "bold");
        doc.text("Vis:", 160, currentY + 5);
        doc.setFont("helvetica", "normal");
        doc.text(fields.wx_vis || '', 168, currentY + 5);

        currentY += 15;
    }

    // Assessment Table
    const assessmentSection = schema.sections.find((s: any) => s.id === 'assessment');
    if (assessmentSection) {
        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(15, currentY, 180, 8, 'FD');
        doc.setFont("helvetica", "bold");
        doc.text("Task", 17, currentY + 5);
        doc.text("Yes/No", 90, currentY + 5);
        doc.text("Grade", 102, currentY + 5);
        doc.text("Comment", 117, currentY + 5);
        currentY += 8;

        doc.setFont("helvetica", "normal");

        assessmentSection.items.forEach((item: any) => {
            const rowStart = currentY;
            // Task Column
            doc.setFont("helvetica", "bold");
            doc.text(item.task, 17, currentY + 5);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const splitSub = doc.splitTextToSize(item.subtext, 70);
            doc.text(splitSub, 17, currentY + 9);
            const rowHeight = Math.max(12, (splitSub.length * 4) + 6);

            // Inputs
            const yesNo = checklistData.data.assessment?.[`${item.id}_yesNo`] || '';
            const grade = checklistData.data.assessment?.[`${item.id}_grade`] || '';
            const comment = checklistData.data.assessment?.[`${item.id}_comment`] || '';

            doc.setFontSize(10);
            doc.text(yesNo, 95, currentY + 6, { align: 'center' });
            doc.text(grade, 109, currentY + 6, { align: 'center' });

            const splitComment = doc.splitTextToSize(comment, 75);
            doc.text(splitComment, 118, currentY + 5);

            // Lines
            doc.rect(15, rowStart, 73, rowHeight); // Task
            doc.rect(88, rowStart, 14, rowHeight); // Yes/No
            doc.rect(102, rowStart, 14, rowHeight); // Grade
            doc.rect(116, rowStart, 79, rowHeight); // Comment

            currentY += rowHeight;
        });

        currentY += 10;
    }

    // Scoring Legend
    const scoringSection = schema.sections.find((s: any) => s.id === 'scoring');
    if (scoringSection) {
        doc.setFont("helvetica", "bold");
        doc.text("Scoring Table", 15, currentY);
        currentY += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        scoringSection.text.forEach((line: string) => {
            doc.text(line, 15, currentY);
            currentY += 5;
        });
        currentY += 10;
    }

    // Signatures
    // Box for signatures
    const footerY = pageHeight - 30; // Fixed footer position
    doc.rect(15, footerY, 180, 15);
    doc.line(105, footerY, 105, footerY + 15); // Vert split
    doc.line(15, footerY + 7.5, 195, footerY + 7.5); // Horiz split

    doc.setFontSize(10);
    doc.text("Reviewer:", 17, footerY + 5);
    doc.text(checklistData.names?.['Reviewer'] || '', 40, footerY + 5);
    // Sig
    if (checklistData.signatures?.['Reviewer']) {
        try { doc.addImage(checklistData.signatures['Reviewer'], 'PNG', 110, footerY + 1, 30, 6); } catch (e) { }
    }

    doc.text("Trainee Pilot/Pilot:", 17, footerY + 12.5);
    doc.text(checklistData.names?.['Trainee Pilot/Pilot'] || '', 55, footerY + 12.5);
    // Sig
    if (checklistData.signatures?.['Trainee Pilot/Pilot']) {
        try { doc.addImage(checklistData.signatures['Trainee Pilot/Pilot'], 'PNG', 110, footerY + 8, 30, 6); } catch (e) { }
    }

    doc.text("Signed", 107, footerY + 5);
    doc.text("Signed", 107, footerY + 12.5);


    // Output
    if (outputType === 'datauristring') {
        return doc.output('datauristring');
    } else if (outputType === 'blob') {
        return doc.output('blob');
    } else {
        doc.save(`peer-review-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    }
};

const generatePassagePlanPDF = (checklistData: any, schema: any, outputType: 'save' | 'blob' | 'datauristring' = 'save') => {
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
        doc.addImage(LOGO_BASE64, 'JPEG', 15, 10, 35, 35); // 35x35mm
    } catch (e) {
        console.warn("Could not add logo", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Fiordland Passage Plan Checklist", 100, 20, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10); // Reduced to 10pt (Arial Regular equiv)
    doc.text("Date:", 100, 35);
    const dateStr = checklistData.date ? format(new Date(checklistData.date), 'dd/MM/yyyy') : '';
    doc.text(dateStr, 120, 35);
    doc.setDrawColor(150);
    doc.line(118, 36, 190, 36); // Dotted line effect (solid for now)

    let currentY = 50;

    // Vessel Details
    doc.setFontSize(10); // Reduced to 10pt
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
        if (!section) {
            console.warn(`PDF Gen: Section ${sectionId} not found in schema`);
            return;
        }

        if (title) {
            doc.setFont("helvetica", "bold");
            doc.text(title, 15, currentY);
            currentY += 8;
        }

        const sectionData = checklistData.data[sectionId] || {};
        console.log(`PDF Gen: Rendering section ${sectionId}, found data:`, sectionData);

        doc.setFont("helvetica", "normal");
        section.items?.forEach((item: string, idx: number) => {
            const isChecked = !!sectionData[`item-${idx}`];
            drawCheckbox(20, currentY - 4, isChecked);
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
        doc.addImage(LOGO_BASE64, 'JPEG', 15, 10, 35, 35); // 35x35mm
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
