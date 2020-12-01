import {shuffle} from 'underscore'

class Bolsa {
    constructor(){
        this.bolsaFichas = []; 
        this.generarFichas();
        this.revolverFichas();
    }

    generarFichas(){
        let id = 1;
        for (let i = 0; i < 29; i++) {
            for (let j = i; j < 7; j++) {
                this.bolsaFichas.push({id, vs:i, vi:j});// vs = valor superior, vi = valor inferior
                id++;
            }
        }
    }

    revolverFichas(){
        this.bolsaFichas = shuffle(this.bolsaFichas);
    }

    tomarFicha(){
        return this.bolsaFichas.pop();
    }

    fichasIniciales(){
        let fichas = [];

        for (let i = 0; i < 7; i++) {
            fichas.push(this.tomarFicha());
        }

        return fichas;
    }

    reiniciarBolsa(){
        this.bolsaFichas = [];
        this.generarFichas();
        this.revolverFichas();
    }
}

export default Bolsa;