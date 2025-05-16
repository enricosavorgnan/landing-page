<?php



// Configurazione database

$servername = "62.149.153.30";

$username = "MSSql214424";

$password = "TOMMIdatabase16?";

$dbname = "MSSql214424";



// Connessione al database MS SQL

$conn = new PDO("sqlsrv:server=$servername;Database=$dbname", $username, $password);



// Controlla se la connessione è riuscita

if (!$conn) {

    die("Connection failed: " . print_r(sqlsrv_errors(), true));

}



// Recupera i dati dal form

$isParent = isset($_POST['is_parent']) && $_POST['is_parent'] === 'yes' ? 1 : 0;

$isEducator = isset($_POST['is_educator']) && $_POST['is_educator'] === 'yes' ? 1 : 0;

$email = !empty($_POST['email']) ? $_POST['email'] : null;



// Query SQL per inserire i dati

$sql = "INSERT INTO SurveyResponses (is_parent, is_educator, email) VALUES (:is_parent, :is_educator, :email)";

$stmt = $conn->prepare($sql);



$stmt->bindParam(':is_parent', $isParent, PDO::PARAM_INT);

$stmt->bindParam(':is_educator', $isEducator, PDO::PARAM_INT);

$stmt->bindParam(':email', $email, PDO::PARAM_STR);



// Esegui la query

if ($stmt->execute()) {

    echo "Grazie per aver completato il sondaggio!";

} else {

    echo "Errore: " . print_r($stmt->errorInfo(), true);

}



// Chiudi la connessione

$conn = null;