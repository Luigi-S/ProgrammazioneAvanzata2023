# ProgrammazioneAvanzata2023
Progetto del corso di Programmazione Avanzata del 2022/23



## Progettazione - Pattern

### MVC

Il pattern MVC (Model-View-Controller) è un pattern architetturale che suddivide una applicazione in tre componenti.
Il Model rappresenta i dati e la business logic dell'applicazione. Gestisce l'accesso ai dati, le operazioni di lettura e scrittura e le regole di validazione, che vedremo essere scorporate dai modelli in sé, grazie ai middleware, per aumentare comprensibilità e flessibililtà del codice.
La View si occupa della presentazione dei dati all'utente. Mostra i dati in un formato comprensibile e interagisce con l'utente per ricevere input. Essa può essere un'interfaccia  grafica (GUI), una pagina HTML, un JSON o qualsiasi altra forma di visualizzazione dei dati. Da consegna, l'applicazione deve restituire solo un JSON con i dati richiesti, e/o l'esito dell'operazione, di conseguenza la View è molto semplice, lasciando al client l'eventuale implementazione di una visualizzazione. Ad esempio, Express supporta l'utilizzo di template engine come Handlebars, EJS o Pug per generare dinamicamente il contenuto HTML da visualizzare.
Il Controller agisce come intermediario tra il Modello e la Vista. Riceve gli input dell'utente dalla Vista, interpreta tali input e interagisce con il Model per ottenere i dati necessari. Successivamente, aggiorna la View con i dati appropriati in risposta all'input dell'utente. In particolare, i controller dell'applicazione andranno ad interagire direttamente con gli endpoint di routing, dichiarati in server.ts, attraverso Express. Sono nel modulo 'controller' e suddivisi in più file, in base al cnotesto della logica di business che vanno a collegare.

### Singleton

Il Singleton fa parte dei Design Pattern creazionali, oopera a livello classe. Consiste in una classe dotata di un costruttore privato, che è utilizzato una sola volta, alla prima chiamata, per istanziare la sola istanza dell’oggetto, che sarà accessibile globalmente. Il pattern viola il principio di responsabilità singola, ed è per questo anche detto anti-pattern.
Nel sistema è impiegato per connettersi al database Postgres, attraverso Sequelize. Questo impiego del pattern Singleton per la connessione a servizi esterni come il DB è tipico. Questo perché semplifica l'interazione a questo con processi, spesso asincroni, che rischierebbero di minare la consistenza dei dati.

### Chain of Responsibility (CoR)

Il pattern CoR fa parte dei Design Pattern comportamentali. Permette di separare una richiesta complessa in una serie di passaggi gestiti da oggetti distinti. Simili a Decorator, la catena può interrompersi ad ogni anello, invece i decoratori hanno problemi con l’ordine nel quale sono posti, non possono, infatti, rompere il flusso della sequenza.

Nel contesto di un server Node.js con Express, può essere applicato per gestire i middleware. Ogni middleware rappresenta un nodo nella catena e può decidere se gestire la richiesta o passarla al middleware successivo. Questo offre flessibilità e modularità nell'elaborazione delle richieste, riutilizzando middleware oppure aggiungendo o togliendo elementi alla catena.
Nel modulo 'middleware' sono raccolti, separati su file in base a contesto, le varie funzioni, in particolare, auth_middleware.ts, per la parte comune di autenticazione ed autorizzazione, request_middleware.ts per middleware generici, riguardanti payload o rotta. Infine, in cor.ts, sono dichiarate le 'catene' di middleware, poi impiegate nel routing. 

### Factory

La Factory fa parte dei Design Pattern creazionali,crea un'interfaccia per la creazione di oggetti di .
Tale pattern è stato utilizzato per la creazione di oggetti che descrivono errori o successi del servizio, essendo questi ultimi accumunati dalla medesima struttura (status code e messaggio da ritornare nella risposta HTTP).
Nel dettaglio, la Factory è implementata in factory.