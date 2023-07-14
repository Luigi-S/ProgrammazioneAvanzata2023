# ProgrammazioneAvanzata2023
Progetto del corso di Programmazione Avanzata del 2022/23

## Descrizione applicazione

### Requisiti

Nel file requisites.docx sono riportate le richieste della consegna per l'applicazione.

### Rotte
Nella tabella che segue, sono descritte le rotte implementate nell'applicazione, successivaemnte si descrive brevemente per ciascuna rotta, il funzionamento e come costruire la relativa richiesta.

| Req Method |    Rotta   |Costo token|
|------------|------------|-----------|
|    POST    |   /food    |     1     |
|    PUT     | /food/\<id\> |     1     |
|    POST    |  /order    |     1     |
|    POST    |/order/\<id\> |     1     |
|    GET     |/order/\<id\> |     1     |
|    POST    | /load/\<id\> |     1     |
|    GET     |   /list    |     0     |
|    POST    |/admin/token|     0     |

### POST: /food
Creazione di un nuovo alimento, per farlo si utilizza un token generato con un payload JSON di questo tipo:
```
{
    "user": "\<utente\>",
    "name": "\<nome-alimento\>",
    "quantity": \<disponibiltà-alimento\>
}
```
Dove: 'user' identifica l'utente che esegue la richiesta, 'name' è il nome associato all'alimento, che non deve essere già impiegato e 'quantity' è il numero, positivo, che indica la quantità del nuovo alimento disponibile.

### PUT: /food/\<id\>
Aggiornare un alimento, identificato dal parametro \<id\>, il payload è analogo a quello per la creazione di un nuovo alimento, tuttavia sia 'name' che 'quantity' sono parametri opzionali, infatti, se non specificati, rimarranno inalterati. Valgono gli stessi criteri della POST per i valori dei parametri accettati, inoltre, la richiesta fallisce se nessuno dei due parametri è specificato.

### POST /order
Creazione di un nuovo ordine, prevede che si specifichi nel payload un array 'loads', composto dagli alimenti richiesti, identificati dal numero di id 'food' e dalla quantità richiesta, 'quantity'. Verrà restituito l'id dell'ordine, se correttamente creata l'istanza nel DB.
```
{
    "user": "\<utente\>",
    "loads":[
        {
            "food": \<id-alimento\>,
            "quantity": \<quantità-richiesta\>
        },
        ...
    ]
}
```
L'ordine è rifiutato se la quantità richiesta di un alimento è nulla, negativa o eccede le disponibilità dell'alimento associato, oppure se l'id dell'alimento non corrisponde ad un elemento a DB, o è ripetuto più volte nell'ordine. L'ordine è creato con stato 'CREATO', non è possibile effettuare i carichi fino all'effettivo inizio dell'esecuzione.

### POST /order/\<id\>
Presa in carico di un ordine, il payload include solo l'utente al quale verrà scalato il token, l'ordine corrispondente l'id indicato come parametro nella rotta è preso in carico, lo stato passa a 'IN ESECUZIONE' e sarà possibile eseguire i carichi con la rotta /load/\<id\>.
```
{
    "user": "\<utente\>"
}
```

### GET /order/\<id\>
Rotta che permette di verificare lo stato di esecuzione di un ordine specificandone l'\<id\> nella rotta. Se l'ordine è completato, ovvero se 'state' è 'COMPLETATO', saranno calcolate: la durata complessiva dell'ordine, ovvero la differenza fra 'start', il timestamp della presa in carico, e 'finish', quello dell'ultimo carico, inotre per ogni carico effettuato sarà calcolato lo scarto fra quantità caricata effettivamente, 'actual_q', e quella richiesta, 'requested_q'.

### POST /load/\<id\>
Effettua un carico relativo l'ordine identificato da \<id\>. Il payload è della forma:
```
{
    "user": "\<utente\>",
    "food": \<id-alimento\>,
    "quantity": \<quantità-caricata\>
}
```
Si otterrà response con bad request, se non esiste un alimento con id \<food\>, o se 'quantity' non è positiva. Si avrà invece che l'ordine è fallito, 'state' passa a 'FALLITO', se: 'food' non corrisponde ad un alimento facente parte dell'ordine, o se non rispetta la sequenza di carico, oppure se la quantità caricata si discosta da quella richiesta oltre un certo margine, indicato dalla variabile di ambiente N, specificata nel file .env (se N non è indicata, il margine è nullo).

### GET /list
Rotta che non richiede autorizzazione di alcun tipo, restituisce un json, 'loads' presenta un dizionario, che ha per chiavi gli id degli ordini con almeno un carico completato, e per valori i dati di tali carichi. Opzionalmente, si possono specificare come query parameters, 'start' ed 'end', data di inizio e fine del periodo entro il quale individuare il 'timestamp' dei carichi. Entrambe le date sono opzionali, e se ne può specificare anche una singola, in tal caso il periodo è considerato illimitato. La richiesta darà esito negativo se le date non sono nel formato 'DD-MM-YYYY' o'DD/MM/YYYY', oppure se la data di conclusione del periodo è precedente a quella d'inizio.

### POST /admin/token
```
{
    "user": "\<admin\>",
    "user_email": \<user-destinazione\>,
    "tokens": \<nuovo-numero-token\>
}
```
Se "user" corrisponde ad un account con "role" Admin, "user_email" ad un account valido e  "tokens" non è negativo, il credito di token dell'utente identificato da "user_email", è aggiornato al nuovo valore "token".


## Progettazione - Pattern

### MVC

Il pattern MVC (Model-View-Controller) è un pattern architetturale che suddivide una applicazione in tre componenti.
Il Model rappresenta i dati e la business logic dell'applicazione. Gestisce l'accesso ai dati, le operazioni di lettura e scrittura e le regole di validazione, che vedremo essere scorporate dai modelli in sé, grazie ai middleware, per aumentare comprensibilità e flessibililtà del codice.

La View si occupa della presentazione dei dati all'utente. Mostra i dati in un formato comprensibile e interagisce con l'utente per ricevere input. Essa può essere un'interfaccia  grafica (GUI), una pagina HTML, un JSON o qualsiasi altra forma di visualizzazione dei dati. Da consegna, l'applicazione deve restituire solo un JSON con i dati richiesti, e/o l'esito dell'operazione, di conseguenza la View è molto semplice, lasciando al client l'eventuale implementazione di una visualizzazione. Ad esempio, Express supporta l'utilizzo di template engine come Handlebars, EJS o Pug per generare dinamicamente il contenuto HTML da visualizzare.

Il Controller agisce come intermediario tra il Modello e la Vista. Riceve gli input dell'utente dalla Vista, interpreta tali input e interagisce con il Model per ottenere i dati necessari. Successivamente, aggiorna la View con i dati appropriati in risposta all'input dell'utente. In particolare, i controller dell'applicazione andranno ad interagire direttamente con gli endpoint di routing, dichiarati in server.ts, attraverso Express. Sono nel modulo 'controller' e suddivisi in più file, in base al cnotesto della logica di business che vanno a collegare.

### Singleton

Il Singleton fa parte dei Design Pattern creazionali, ed opera a livello classe. Consiste in una classe dotata di un costruttore privato, che è utilizzato una sola volta, alla prima chiamata, per istanziare la sola istanza dell’oggetto, che sarà accessibile globalmente. Il pattern viola il principio di responsabilità singola, ed è per questo anche detto anti-pattern.

Nell'applicazione è impiegato per connettersi al database Postgres, attraverso Sequelize. Questo impiego del pattern Singleton per la connessione a servizi esterni come il DB è tipico. Questo perché semplifica l'interazione a questo con processi, spesso asincroni, che rischierebbero di minare la consistenza dei dati.

### Chain of Responsibility (CoR)

Il pattern CoR fa parte dei Design Pattern comportamentali. Permette di separare una richiesta complessa in una serie di passaggi gestiti da oggetti distinti. Simili a Decorator, la catena può interrompersi ad ogni anello, invece i decoratori hanno problemi con l’ordine nel quale sono posti, non possono, infatti, rompere il flusso della sequenza.

Nel contesto di un server Node.js con Express, può essere applicato per gestire i middleware. Ogni middleware rappresenta un nodo nella catena e può decidere se gestire la richiesta o passarla al middleware successivo. Questo offre flessibilità e modularità nell'elaborazione delle richieste, riutilizzando middleware oppure aggiungendo o togliendo elementi alla catena.
Nel modulo 'middleware' sono raccolti, separati su file in base a contesto, le varie funzioni, in particolare, auth_middleware.ts, per la parte comune di autenticazione ed autorizzazione, request_middleware.ts per middleware generici, riguardanti payload o rotta. Infine, in cor.ts, sono dichiarate le 'catene' di middleware, poi impiegate nel routing. 

### Factory
La Factory fa parte dei Design Pattern creazionali,crea un'interfaccia per la creazione di oggetti appartenenti ad una stessa famiglia. Si basa su una funzione che ha come valore di ritorno un oggetto del quale si specifica un'interfaccia da implementare o un oggetto da estendere. Il valore di ritorno potrà così essere di varie classi simili. In alternatica si può lavorare con più famiglie di classi, correlate in qualche modo con AbstractFactory e varie implementazioni, una per ciascuna famiglia.

Tale pattern è stato utilizzato nell'applicazione per la creazione di oggetti impiegati nel processo di error handling, accompagnando all'errore, un messaggio e l'HTTP status associato.

## Avvio applicazione
Per lanciare l'applicazione, è necessario disporre di Docker installato e operativo. Come prima cosa, è necessario genrare la chiave pubblica e privata per la generazione dei token JWT. Per farlo, spostarsi in /app ed eseguire i seguenti comandi: 
```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub
```
Generate le chiavi, creare il file .env, o se già esistente, verificare che sia della forma:
```
N= \<value\>
PORT=8080
HOST='0.0.0.0'
```
Dove N è il valore compreso fra 0 ed 1, del possibile scarto percentuale fra la quantità di alimento caricata e quella richiesta alla creazione dell'ordine.

Finalmente, si può lanciare l'applicazione con 
```
docker compose up --build
```
Si potranno eseguire le richieste sulla porta 8080 del localhost, inoltre sulla porta 8000, è possibile utilizzare l'interfaccia grafica di Adminer per interagire con il database.