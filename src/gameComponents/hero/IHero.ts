
/*

    La Parte "I" non è altro che un interfaccia utile a definire tutti
    i metodi che devono essere implementati dal giocatore.

    # Ricorda di sostituire Il nome del file + il nome dopo "interface"
    # con il nome della classe che implementa l'interfaccia e sopratutto
    # aggiungere la dichiarazione "export default nome_classe"

*/

interface IPlayer {
    update(time: number, delta: number): void;
  }
  export default IPlayer;