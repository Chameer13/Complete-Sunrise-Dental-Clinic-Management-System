package com.sunrise.dental.service;
import org.springframework.beans.factory.annotation.*; import org.springframework.mail.SimpleMailMessage; import org.springframework.mail.javamail.JavaMailSender; import org.springframework.stereotype.Service;
@Service public class MailService {
 private final JavaMailSender sender; private final boolean enabled; private final String from;
 public MailService(JavaMailSender s,@Value("${app.mail.enabled}") boolean e,@Value("${app.mail.from}") String f){sender=s;enabled=e;from=f;}
 public boolean send(String to,String subject,String body){if(!enabled){System.out.println("MAIL [development mode] -> "+to+" | "+subject+" | "+body);return false;} try{var m=new SimpleMailMessage();m.setFrom(from);m.setTo(to);m.setSubject(subject);m.setText(body);sender.send(m);return true;}catch(Exception e){return false;}}
}
