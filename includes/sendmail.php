<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit;
}

// Get form data
$form_name = $_POST['form_name'] ?? '';
$form_email = $_POST['form_email'] ?? '';
$form_subject = $_POST['form_subject'] ?? '';
$form_phone = $_POST['form_phone'] ?? 'Not provided';
$form_message = $_POST['form_message'] ?? '';
$form_botcheck = $_POST['form_botcheck'] ?? '';

// Basic spam protection
if (!empty($form_botcheck)) {
    http_response_code(400);
    echo json_encode(['message' => 'Bot detected']);
    exit;
}

// Validate required fields
if (empty($form_name) || empty($form_email) || empty($form_subject) || empty($form_message)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

// EmailJS API call
$emailjs_data = [
    'service_id' => 'service_cfmcw',
    'template_id' => 'template_m7732st',
    'user_id' => 'FLntTEBuyN134J25J',
    'template_params' => [
        'from_name' => $form_name,
        'from_email' => $form_email,
        'subject' => $form_subject,
        'phone' => $form_phone,
        'message' => $form_message,
    ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.emailjs.com/api/v1.0/email/send');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailjs_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    echo json_encode(['message' => 'Email sent successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to send email']);
}
?>