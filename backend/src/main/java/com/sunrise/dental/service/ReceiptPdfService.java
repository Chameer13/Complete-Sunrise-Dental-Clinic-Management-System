package com.sunrise.dental.service;

import com.sunrise.dental.entity.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptPdfService {
    private static final PDType1Font BOLD = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
    private static final PDType1Font REGULAR = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
    private static final DateTimeFormatter DT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public byte[] createReceipt(PaymentTransaction payment) {
        Bill b = payment.getBill();
        Appointment a = b.getAppointment();
        try (PDDocument doc = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (PDPageContentStream c = new PDPageContentStream(doc, page)) {
                float x=55, y=790;
                font(c, BOLD, 20, x, y, "SUNRISE DENTAL CLINIC");
                y-=25; font(c, REGULAR, 10, x, y, "Payment Receipt");
                y-=35;
                line(c,x,y,540,y); y-=25;
                row(c,"Receipt No.", "RCPT-"+payment.getTransactionReference(), x,y); y-=18;
                row(c,"Bill No.", b.getBillNumber(), x,y); y-=18;
                row(c,"Payment Ref.", payment.getTransactionReference(), x,y); y-=18;
                row(c,"Payment Date", payment.getPaidAt().format(DT), x,y); y-=30;
                font(c,BOLD,12,x,y,"Patient & Appointment"); y-=20;
                row(c,"Patient",b.getPatient().getFullName(),x,y); y-=18;
                row(c,"Appointment",a.getAppointmentNumber(),x,y); y-=18;
                row(c,"Dentist", dentistName(a.getDentist()),x,y); y-=18;
                row(c,"Date & Time",a.getAppointmentDateTime().format(DT),x,y); y-=18;
                row(c,"Treatment",a.getTreatment().getName(),x,y); y-=30;
                font(c,BOLD,12,x,y,"Payment Summary"); y-=22;
                row(c,"Treatment fee",money(b.getSubtotal()),x,y); y-=18;
                row(c,"Consultation fee",money(b.getConsultationFee()),x,y); y-=18;
                row(c,"Discount",money(b.getDiscount()),x,y); y-=18;
                row(c,"Tax",money(b.getTax()),x,y); y-=18;
                line(c,x,y,540,y); y-=22;
                row(c,"TOTAL PAID",money(b.getTotal()),x,y); y-=28;
                row(c,"Payment method",payment.getPaymentMethod().name(),x,y); y-=18;
                if(payment.getCardLast4()!=null) row(c,"Card","**** **** **** "+payment.getCardLast4(),x,y);
                y-=35;
                font(c,BOLD,11,x,y,"Thank you for choosing Sunrise Dental Clinic.");
                y-=18; font(c,REGULAR,9,x,y,"This receipt confirms payment recorded by the clinic system.");
            }
            doc.save(out);
            return out.toByteArray();
        } catch(Exception e) {
            throw new IllegalStateException("Unable to generate receipt PDF.",e);
        }
    }
    private String dentistName(Dentist d){ return d.getRegistrationNumber()+" - "+d.getSpecialization(); }
    private String money(BigDecimal n){return "Rs. "+n.setScale(2).toPlainString();}
    private void row(PDPageContentStream c,String k,String v,float x,float y)throws Exception{
        font(c,BOLD,9,x,y,k+":");
        font(c,REGULAR,9,190,y,v==null?"":v);
    }
    private void font(PDPageContentStream c,PDType1Font f,float size,float x,float y,String text)throws Exception{
        c.beginText(); c.setFont(f,size); c.newLineAtOffset(x,y); c.showText(text==null?"":text); c.endText();
    }
    private void line(PDPageContentStream c,float x1,float y1,float x2,float y2)throws Exception{
        c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke();
    }
}
