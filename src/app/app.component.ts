import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-form-demo';
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    country: this.fb.control<number | null>(null, Validators.required),
    city: this.fb.control<number | null>(null, Validators.required),
  });
  countries: ICountry[] = [
    { CountryID: 1, CountryName: 'USA' },
    { CountryID: 2, CountryName: 'Canada' },
    { CountryID: 3, CountryName: 'India' },
  ];
  cities: ICity[] = [
    { CityID: 1, CityName: 'New York', CountryID: 1 },
    { CityID: 2, CityName: 'Los Angeles', CountryID: 1 },
    { CityID: 3, CityName: 'Toronto', CountryID: 2 },
    { CityID: 4, CityName: 'Vancouver', CountryID: 2 },
    { CityID: 5, CityName: 'Ahmedabad', CountryID: 3 },
    { CityID: 6, CityName: 'Delhi', CountryID: 3 },
    { CityID: 7, CityName: 'Mumbai', CountryID: 3 },
  ];

  get citiesDd() {
    return this.cities.filter(
      (x) => x.CountryID == this.loginForm.value.country
    );
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm.get('country')?.valueChanges.subscribe((country) => {
      this.loginForm.get('city')?.setValue(null);
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted!', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

interface ICountry {
  CountryID: number;
  CountryName: string;
}
interface ICity {
  CityID: number;
  CountryID: number;
  CityName: string;
}
