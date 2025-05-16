<?php
session_start();
// Verifica che i dati siano inviati con POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recupera i dati inviati
    $email = $_POST['email'];
    $parent= $_POST['parent'];
    $educator = $_POST['educator'];

  	$timestamp = date("Y-m-d H:i:s");
  	$session = session_id();
    
    $ip = $_SERVER['REMOTE_ADDR'];
    $geoData = file_get_contents("https://ip-api.com/json/$ip");
    $geoData = json_decode($geoData, true);
    $country = $geoData['country'];
    $city = $geoData['city'];

    // Prepara la stringa da scrivere nel file
    $data = "Data e ora: " . $timestamp . "\n" .
      		"User: " . $session . "\n" .
      		"Genitore: " . $parent . "\n" .
            "Educatore: " . $educator . "\n" .
            "Email: " . $email . "\n" .
            "Location: " . $country . "," . $city . "\n" .
            "---------------------------------\n";

    // Specifica il percorso del file di destinazione
    $file = '../txt/contacts.txt';

    // Scrive i dati nel file (appende i dati senza sovrascrivere)
    file_put_contents($file, $data, FILE_APPEND);
}
?>