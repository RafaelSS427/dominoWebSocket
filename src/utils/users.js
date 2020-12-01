const jugadores = [];
let mesa = [];
let fichaMesa = {id:-1, vs: -1, vi:- 1}; //ficha de mesa

//metodos find y findIndex funcionan solo con variables globales

// Join user to game
const jugadorJoin = (id, username) => {
    const jugador = {id, username};
    jugador.turno = false;

    if(jugadores.length < 4){
        jugadores.push(jugador)
        if(jugadores.length === 1) jugadores[0].anfitrion = true;
        return jugador;
    }
}

const getJugador = (id) => jugadores.find(user => user.id === id); // 2, 4, 5, 7, 8

const jugadorLeave = (id) => {
    const index = jugadores.findIndex(user => user.id === id);// si encuentra = pos, si no o encuentra = -1

    if(index !== -1){ // si lo encontro
        return jugadores.splice(index, 1)[0]; // remueve un elemento a partir de la posicion ingresada
    }

    return {};
}

const removeFicha = (fichas, id) => {
    const index = fichas.indexOf(id);// si encuentra = pos, si no o encuentra = -1

    if(index !== -1){ // si lo encontro
        //console.log('se elimino la ficha');
        fichas.splice(index, 1); // remueve un elemento a partir de la posicion ingresada
    }
}

const getJugadores = () => {
    return jugadores;
}

const darFichasJugadores = (bolsa) => {
    for (const jug of jugadores) {
        jug.mano = bolsa.fichasIniciales();
    }

    //luego de repartir las fichas, concedemos los turnos
    const existeTurno = turnoInicialJugadores(0);// true or false
    if(existeTurno === false) jugadores[0].turno = true;
}

const turnoInicialJugadores = (cont) => {
    let idFichas = [28, 26, 23, 19, 14, 8, 1]; // id de fichas iniciales
    for (const jugador of jugadores) {
        for (const ficha of jugador.mano) {
            if(ficha.id === idFichas[cont]){
                jugador.turno = true;
                return true;
            }
        }
    }

    if(cont === idFichas.length) return false;

    cont++;
    turnoInicialJugadores(cont);
}

const buscarFichaId = (mano, idFicha) => mano.find(ficha => ficha.id == idFicha);

const terminarTurno = () => {
    for (const index in jugadores) {
        if(jugadores[index].turno === true){
            let pos = index;
            jugadores[pos].turno = false;
            pos++;

            if(pos === jugadores.length){
                jugadores[0].turno = true;
            } else {
                jugadores[pos].turno = true;
            }

            return;
        }
    }
}

const setearFichaM = (vs, vi) => {
    fichaMesa.vs = vs;
    fichaMesa.vi = vi;
}

const lanzarFicha = (idJugador, idFicha) =>  {

    const jugador = getJugador(idJugador);

    console.log('El jugador que va a jugar es:', jugador.username);

    if (jugador.turno) {
        const ficha = buscarFichaId(jugador.mano, idFicha);
        console.log('ficha encontrada', ficha);
        let idFichas = [28, 26, 23, 19, 14, 8, 1];
        let jugadaFichaInic = false;
        
        if (mesa.length === 0) {
            for (let i = 0; i < idFichas.length; i++) {
                if (ficha.id === idFichas[i]) {
                    jugadaFichaInic = true;
                    mesa.push(ficha);
                    removeFicha(jugador.mano, ficha);
                    //console.log(jugador);
                    terminarTurno();// terminamos el turno del jugador

                    setearFichaM(ficha.vs, ficha.vi);
                    //i = idFichas.length;
                    return {jugador, fichaMesa};
                }
            }
            if(jugadaFichaInic === false) return {msg: "Esta no es una ficha inicial, intente de nuevo"}
        } else {
            if (ficha.vs === fichaMesa.vs || ficha.vi === fichaMesa.vi
                    || ficha.vi === fichaMesa.vs || ficha.vs === fichaMesa.vi) {

                mesa.push(ficha); // agregamos la ficha a la mesa
                removeFicha(jugador.mano, ficha); // removemos la ficha de la mano del jugador
                terminarTurno(); // terminamos turno de jugador

                //seteamos la ficha
                if (ficha.vs === fichaMesa.vs) {
                    fichaMesa.vs = ficha.vi;
                    return {jugador, fichaMesa};
                } else if (ficha.vi === fichaMesa.vs) {
                    fichaMesa.vs = ficha.vs;
                    return {jugador, fichaMesa};
                }

                if (ficha.vi === fichaMesa.vi) {
                    fichaMesa.vi = ficha.vs;
                    return {jugador, fichaMesa};
                } else if (ficha.vs === fichaMesa.vi) {
                    fichaMesa.vi = ficha.vi;
                    return {jugador, fichaMesa};
                }
            } else {
                return {msg: "Esta ficha no coincide con ninguno de los lados"};
            }
        }
    } else {
        return {msg: "No tienes el turno"};
    }
}

const jugadorTomaFicha = (idJugador, bolsa) => {
    if(bolsa.bolsaFichas.length === 0) return {msg: 'Ya no quedan fichas'};
    const jugador = getJugador(idJugador);
    const ficha = bolsa.tomarFicha();
    jugador.mano.push(ficha);
}

const setearMesa = () => {
    mesa = [];
    setearFichaM(-1, -1);
}

const jugadorGanador = () => jugadores.find(jug => jug.mano.length === 0);

export {
    jugadorJoin,
    getJugador,
    jugadorLeave,
    getJugadores,
    darFichasJugadores,
    lanzarFicha,
    setearMesa,
    jugadorTomaFicha,
    terminarTurno,
    jugadorGanador
}