import { Injectable } from '@angular/core';
import { delay, map, of, tap } from 'rxjs';
import { ICountry, ICity } from './form1/form1.component';
import { NgxUiLoaderService } from '@lib/ngx-ui-loader';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly countries: ICountry[] = [
    { CountryID: 1, CountryName: 'USA' },
    { CountryID: 2, CountryName: 'Canada' },
    { CountryID: 3, CountryName: 'India' },
  ];
  private readonly cities: ICity[] = [
    { CityID: 1, CityName: 'New York', CountryID: 1 },
    { CityID: 2, CityName: 'Los Angeles', CountryID: 1 },
    { CityID: 3, CityName: 'Toronto', CountryID: 2 },
    { CityID: 4, CityName: 'Vancouver', CountryID: 2 },
    { CityID: 5, CityName: 'Ahmedabad', CountryID: 3 },
    { CityID: 6, CityName: 'Delhi', CountryID: 3 },
    { CityID: 7, CityName: 'Mumbai', CountryID: 3 },
  ];
  constructor(private loader: NgxUiLoaderService, private http: HttpClient) {}

  get delayTime() {
    const initial = 0.1 * 1000;
    const upto = 2 * 1000;
    return Math.floor(initial + Math.random() * (upto - initial + 1));
  }

  getCountryData() {
    this.loader.start();
    debugger;
    return this.http.get('/assets/country.json').pipe(
      map((x: any) => x.data as ICountry[]),
      delay(this.delayTime),
      tap(() => {
        this.loader.stop();
      })
    );
  }

  getCityByCountyID(CountryID: number) {
    this.loader.start();
    return this.http.get('/assets/city.json').pipe(
      map((x: any) =>
        (x.data as ICity[]).filter(
          (x1) => CountryID <= 0 || x1.CountryID == CountryID
        )
      ),
      delay(this.delayTime),
      tap(() => {
        this.loader.stop();
      })
    );
  }
}
