export class Empresa {
    constructor(
        public id?: number,
        public nome?: string,
        public segmento?: string,
        public descricao?: string,
        public administrador?: number,
        public fl_aberto?: boolean
    ) { }
}
