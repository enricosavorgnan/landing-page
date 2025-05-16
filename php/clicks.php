<?php
// Nome del file in cui salvare i click
$file = "../txt/clicks.txt";

// Controlla se il file esiste, altrimenti lo crea
if (!file_exists($file)) {
    file_put_contents($file, "0"); // Imposta il conteggio iniziale a 0
}

$timestamp = date("Y-m-d H:i:s");

// Incrementa il conteggio

// Salva il nuovo conteggio nel file
file_put_contents($file, $timestamp, FILE_APPEND);
file_put_contents($file, "\n", FILE_APPEND);
?>