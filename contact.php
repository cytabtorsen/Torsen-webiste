<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');

function respond(bool $ok, string $msg, int $code = 200): never {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $msg], JSON_THROW_ON_ERROR);
    exit;
}

// 1. Method guard
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

// 2. CSRF
session_start();
$token = (string)($_POST['csrf_token'] ?? '');
if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
    respond(false, 'Invalid session. Please refresh and try again.', 403);
}
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// 3. Honeypot
if (!empty($_POST['website'])) {
    respond(true, 'Message received.');
}

// 4. Rate-limit (1 per 60s per IP)
$rl_dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'torsen_rl';
if (!is_dir($rl_dir)) { @mkdir($rl_dir, 0700, true); }
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lock = $rl_dir . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.lock';
if (is_file($lock) && (time() - (int)@file_get_contents($lock)) < 60) {
    respond(false, 'Please wait a moment before submitting again.', 429);
}
@file_put_contents($lock, (string)time(), LOCK_EX);

// 5. Validate
$raw_email = trim((string)($_POST['email'] ?? ''));
$raw_msg   = trim((string)($_POST['message'] ?? ''));

if ($raw_email === '') { respond(false, 'Email is required.', 422); }
$email = filter_var($raw_email, FILTER_VALIDATE_EMAIL);
if ($email === false) { respond(false, 'Please enter a valid email.', 422); }

$message = mb_substr(strip_tags($raw_msg), 0, 2000, 'UTF-8');

// 6. Build email
$to      = 'cyrilletabe@torsen.ai';
$subject = '[Torsen] New message from torsen.ai';

$body  = "New contact form submission\n";
$body .= str_repeat('-', 44) . "\n";
$body .= "From : " . $email . "\n";
$body .= "Time : " . gmdate('Y-m-d H:i:s') . " UTC\n";
$body .= str_repeat('-', 44) . "\n\n";
$body .= ($message !== '') ? $message : '(no message provided)';
$body .= "\n";

$headers  = "From: Torsen Website <noreply@torsen.ai>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 7. Send
$sent = mail($to, $subject, $body, $headers);

if ($sent) { respond(true, 'Message received.'); }

error_log('[torsen] mail() failed | ip=' . hash('sha256', $ip));
respond(false, 'Something went wrong. Please email us directly at hello@torsen.ai.', 500);
