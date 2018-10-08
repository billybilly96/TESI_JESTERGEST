import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-login-users',
  templateUrl: './login-users.component.html',
  styleUrls: ['./login-users.component.scss']
})
export class LoginUsersComponent implements OnInit {

  private token: any = "";
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  private returnUrl: string;
  public login_form: FormGroup;
  public hide: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) { 
    this.login_form = formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  /**
   * Metodo che controlla la tipologia di errore quando l'utente non inserisce
   * correttamente l'email nel form di login. 
   */
  getEmailErrorMessage(): string {
    return this.email.hasError('required') ? 'Devi inserire un valore' :
      this.email.hasError('email') ? 'Non hai inserito una email valida' : '';
  }

  /**
   * Metodo che invia al server i dati di autenticazione dell'utente e controlla
   * se può accedere correttamente all'interno dell'applicazione.
   */
  login(): void {
    this.authService.login(this.login_form.value, this.token)
      .subscribe(
        response => {
          console.log(response, 
            this.login_form.value);
          if (this.authService.checkIfUserIsLogged()) {
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  checkToken(): void {
    this.authService.checkToken().subscribe(token => {
      this.token = token.csrfToken;
      console.log(token);
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("Login | Mazapégul");
    this.checkToken();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

}
