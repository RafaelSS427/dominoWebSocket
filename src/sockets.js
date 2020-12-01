//import clases
import Bolsa from './class/Bolsa'
import { jugadorJoin, jugadorLeave, getJugadores, darFichasJugadores, lanzarFicha, setearMesa, jugadorTomaFicha, terminarTurno, jugadorGanador } from './utils/users';

//Juego
const bolsa = new Bolsa();
let start = false; //saber si se puede iniciar el juego





const connection =  (io) => {

    io.on('connection', socket => {

        const sendHeartbeat = () => { 
            setTimeout(sendHeartbeat, 2000); io.emit('ping', { beat : 1 }); 
        }
        
        //io.engine.clientsCount -> numero de clientes conectados
        console.log('Usuario conectado');

        if(start){
            socket.emit('redirect', null);
        }

        socket.on('agregar_jug', (nombre) => { // me llega el nombre del jugador
            const jugador = jugadorJoin(socket.id, nombre);

            //start = getJugadores().length >= 2;
            
            socket.emit('agregar_jug', jugador); // se regresa el jugador del cliente

            io.emit('enviando_jugadores', getJugadores()); // se envia todos los jugadores
        });

        socket.on('start', () => {
            start = getJugadores().length >= 2;
            if(start) {
                darFichasJugadores(bolsa);
                io.emit('start', {start, jugadores: getJugadores(), bolsa: bolsa.bolsaFichas.length});
            } else {
                socket.emit('start', {start, msg:'Faltan jugadores, no se ha podido iniciar el juego'});
            }
        });

        socket.on('tirar_ficha', (data) => {
            const { id, idJug } = data;

            const paquete = lanzarFicha(idJug, id);
            socket.emit('tirar_ficha', paquete);

            
            if(paquete.fichaMesa){
                paquete.jugadores = getJugadores();
                io.emit('ficha_mesa', paquete);
            }

            const ganador = jugadorGanador(); 

            if(!(ganador === undefined)){
                io.emit('jugador_ganador', {msg: `${ganador.username} ha ganado la partida`});
            }
        });

        socket.on('tomar_ficha', (jugador) => {
            const data = jugadorTomaFicha(jugador.id, bolsa);
            const paquete = {jugadores: getJugadores(), bolsa: bolsa.bolsaFichas.length}

            if(!(data === undefined)){
                const { msg } = data;
                socket.emit('bolsa_vacia', msg); 
            }

            io.emit('tomar_ficha', paquete);
            //io.emit('numeroFichasB', {bolsa: bolsa.bolsaFichas.length});
        });

        socket.on('terminar_turno', () => {
            terminarTurno();

            io.emit('terminar_turno', {jugadores: getJugadores()});
        });

        socket.on('pong', (data) => { 
            console.log("Manteniendo hilo de socket activo del cliente"); 
        });

        setTimeout(sendHeartbeat, 2000); // se ejecuta el intervalo de tiempo para mantener viva la conexion

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');

            const jugador = jugadorLeave(socket.id);

            console.log("Jugador desconectado:", jugador.username);

            if(jugador.mano && start){ // si se desconecta un jugador que tiene fichas y el juego esta iniciado
                start = false;
                bolsa.reiniciarBolsa();
                setearMesa();
                io.emit('jug_desconectado_juego', jugador);
            } else {
                io.emit('jug_desconectado_loop', {
                    jugador,
                    jugadores: getJugadores()
                });
            }

            if(jugador.anfitrion){
                io.emit('jug_desconectado_juego', jugador);
            }

        });
    });
}

export default connection;