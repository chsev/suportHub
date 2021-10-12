export class Usuario {
    constructor(
        public id?: number,
        public nome?: string,
        public login?: string,
        public senha?: string,
        public email?: string,
        public funcao?: string,
        public perfil?: string
    ) {}
}
