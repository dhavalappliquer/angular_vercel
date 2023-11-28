import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => {
    debugger;
    console.log('==========');
    console.error(err);
    console.log('==========');
  });
