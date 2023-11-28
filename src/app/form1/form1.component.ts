import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { LoDashStatic } from 'lodash';

declare var _: LoDashStatic;

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css'],
})
export class Form1Component implements OnInit {
  title = 'ng-form-demo';
  skills = [
    { id: '1', name: 'Java' },
    { id: '2', name: 'Python' },
    { id: '3', name: 'React js' },
  ];
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    country: this.fb.control<number | null>(null, Validators.required),
    city: this.fb.control<number | null>(null, Validators.required),
    gender: [null, Validators.required],
    skills: this.fb.control<string[]>([], Validators.required),
    address: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.max(9999999999)]],
  });
  countries: ICountry[] = [];
  cities: ICity[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.skills = _.orderBy(this.skills, [(z) => z], ['asc']);
    this.formEvent();
    this.loadCountry();
    this.loadCities(0);
  }

  formEvent() {
    this.loginForm.get('country')?.valueChanges.subscribe((country) => {
      console.log('change country');
      this.loadCities(country || 0);
    });
    this.loginForm.get('city')?.valueChanges.subscribe((cityID) => {
      const country =
        this.cities.find((x) => x.CityID == cityID)?.CountryID || null;
      console.log('change city');
      this.loginForm.patchValue(
        {
          country: country,
        },
        { emitEvent: country != this.loginForm.value.country }
      );
    });
  }

  loadCountry() {
    this.dataService.getCountryData().subscribe((data) => {
      this.countries = data;
    });
  }

  loadCities(CountryID: number) {
    this.dataService.getCityByCountyID(CountryID).subscribe((data) => {
      this.cities = data;
      const currentCity = this.loginForm.value.city;

      if (this.cities.findIndex((x) => x.CityID == currentCity) == -1) {
        this.loginForm.patchValue(
          {
            city: null,
          },
          { emitEvent: false }
        );
      } else {
        this.loginForm.patchValue(
          {
            city: currentCity,
          },
          { emitEvent: false }
        );
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted!', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onCheckBoxChange($event: Event, skillID: string) {
    const el = $event.target as HTMLInputElement;
    let currentSkills = this.loginForm.value.skills || [];
    let skills = el.checked
      ? [...currentSkills, skillID]
      : currentSkills.filter((x) => x != skillID);

    var a = _.uniq(_.orderBy(skills, [(z) => z], ['asc']));
    this.loginForm.patchValue({
      skills: _.uniq(_.orderBy(skills, [(z) => z], ['asc'])),
    });
  }
}

export interface ICountry {
  CountryID: number;
  CountryName: string;
}
export interface ICity {
  CityID: number;
  CountryID: number;
  CityName: string;
}
