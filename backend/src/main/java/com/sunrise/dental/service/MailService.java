package com.sunrise.dental.service;

import org.springframework.beans.factory.annotation.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {
 private final JavaMailSender sender; private final boolean enabled; private final String from;
 public MailService(JavaMailSender s,@Value("${app.mail.enabled}") boolean e,@Value("${app.mail.from}") String f){sender=s;enabled=e;from=f;}

 public boolean send(String to,String subject,String body){
  if(!enabled){System.out.println("MAIL [development mode] -> "+to+" | "+subject+" | "+body);return false;}
  try{var m=new SimpleMailMessage();m.setFrom(from);m.setTo(to);m.setSubject(subject);m.setText(body);sender.send(m);return true;}
  catch(Exception e){System.err.println("Mail failed: "+e.getMessage());return false;}
 }

 public boolean sendWithAttachment(String to,String subject,String body,String filename,byte[] attachment){
  if(!enabled){System.out.println("MAIL [development mode] -> "+to+" | "+subject+" | "+filename);return false;}
  try{
   var m=sender.createMimeMessage();
   var h=new MimeMessageHelper(m,true,"UTF-8");
   h.setFrom(from); h.setTo(to); h.setSubject(subject); h.setText(body);
   h.addAttachment(filename,new ByteArrayResource(attachment));
   sender.send(m); return true;
  }catch(Exception e){System.err.println("Mail attachment failed: "+e.getMessage());return false;}
 }
}
