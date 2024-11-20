import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localDE from '@angular/common/locales/de';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckForUpdateService } from './appupdateservice';
import { ChangelogModule } from './changelog/changelog.module';
import { EdgeModule } from './edge/edge.module';
import { SettingsModule as EdgeSettingsModule } from './edge/settings/settings.module';
import { SystemLogComponent } from './edge/settings/systemlog/systemlog.component';
import { IndexModule } from './index/index.module';
import { RegistrationModule } from './registration/registration.module';
import { ChartOptionsPopoverComponent } from './shared/chartoptions/popover/popover.component';
import { PickDatePopoverComponent } from './shared/pickdate/popover/popover.component';
import { MyErrorHandler } from './shared/service/myerrorhandler';
import { Pagination } from './shared/service/pagination';
import { SharedModule } from './shared/shared.module';
import { StatusSingleComponent } from './shared/status/single/status.component';
import { registerTranslateExtension } from './shared/translate.extension';
import { Language, MyTranslateLoader } from './shared/type/language';
import { UserModule } from './user/user.module';
import { ProductionHistoryComponent } from './powerchain/production-history/production-history.component';
import { ExchangeMenuComponent } from './powerchain/exchange-menu/exchange-menu.component';
import { OrderBookComponent } from './powerchain/exchange-menu/order-book/order-book.component';
import { PersonalFormComponent } from './powerchain/exchange-menu/transaction-configuration/personal-form/personal-form.component';
import { BuyerFormComponent } from './powerchain/exchange-menu/transaction-configuration/buyer-form/buyer-form.component';
import { SellerFormComponent } from './powerchain/exchange-menu/transaction-configuration/seller-form/seller-form.component';
import { ConfirmationComponent } from './powerchain/exchange-menu/transaction-configuration/confirmation/confirmation.component';
import { TradingService } from './powerchain/exchange-menu/transaction-configuration/trading.service';

// Primeng
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { HistoryExchangeComponent } from './powerchain/exchange-menu/history-exchange/history-exchange.component';
import { TransactionConfigurationComponent } from './powerchain/exchange-menu/transaction-configuration/transaction-configuration.component';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { DashboardComponent } from './powerchain/exchange-menu/history-exchange/dashboard/dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    ChartOptionsPopoverComponent,
    PickDatePopoverComponent,
    StatusSingleComponent,
    SystemLogComponent,
    ProductionHistoryComponent,
    OrderBookComponent,
    ExchangeMenuComponent,
    HistoryExchangeComponent,
    TransactionConfigurationComponent,
    PersonalFormComponent,
    BuyerFormComponent,
    SellerFormComponent,
    ConfirmationComponent,
    DashboardComponent,
  ],
  entryComponents: [ChartOptionsPopoverComponent, PickDatePopoverComponent],
  imports: [
    AngularMyDatePickerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChangelogModule,
    EdgeModule,
    EdgeSettingsModule,
    IndexModule,
    IonicModule.forRoot(),
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: MyTranslateLoader },
    }),
    UserModule,
    RegistrationModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    ButtonModule,
    DialogModule,
    InputNumberModule,
    AutoCompleteModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    ToastModule,
    TabViewModule,
    StepsModule,
    CardModule,
    MessagesModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CookieService,
    { provide: ErrorHandler, useClass: MyErrorHandler },
    { provide: LOCALE_ID, useValue: Language.DEFAULT.key },
    // Use factory for formly. This allows us to use translations in validationMessages.
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateExtension,
      deps: [TranslateService],
    },
    Pagination,
    CheckForUpdateService,
    TradingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localDE);
  }
}
