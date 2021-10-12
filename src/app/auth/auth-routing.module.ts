import { Routes } from "@angular/router";
import { AutocadastroComponent } from "./autocadastro/autocadastro.component";
import { LoginComponent } from "./login/login.component";
export const LoginRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'autocadastro', component: AutocadastroComponent}
];