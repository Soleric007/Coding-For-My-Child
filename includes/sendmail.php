<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_var($_POST['form_name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['form_email'], FILTER_SANITIZE_EMAIL);
    $subject = filter_var($_POST['form_subject'], FILTER_SANITIZE_STRING);
    $phone = filter_var($_POST['form_phone'], FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['form_message'], FILTER_SANITIZE_STRING);
    
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'false', 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'false', 'message' => 'Please enter a valid email address.']);
        exit;
    }
    
    $to = "solomonikennaofficial@gmail.com";
    $email_subject = "Contact Form: " . $subject;
    $email_body = "Name: $name\nEmail: $email\nPhone: $phone\nSubject: $subject\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";
    
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo json_encode(['status' => 'true', 'message' => 'Thank you! Your message has been sent successfully.']);
    } else {
        echo json_encode(['status' => 'false', 'message' => 'Sorry, there was an error sending your message.']);
    }
} else {
    echo json_encode(['status' => 'false', 'message' => 'Invalid request method.']);
}
?>