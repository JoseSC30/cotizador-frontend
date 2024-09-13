import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PaypalService } from '../../services/paypal.service';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';

declare let paypal: any;

@Component({
  selector: 'app-modal-paypal',
  templateUrl: './modal-paypal.component.html',
  styleUrls: ['./modal-paypal.component.css'],
})
export class ModalPaypalComponent implements OnInit {
  private readonly baseUrl: string = environment.baseUrl;

  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('paypal', { static: true }) paypalButton?: ElementRef;

  public selectedPaymentMethod: string = '';
  public paymentMethods!: { name: string; image: string; label: string }[];

  constructor(
    private paypalService: PaypalService,
    private alertsService: AlertsService,
    private router: Router
  ) {
    this.paymentMethods = [
      {
        name: 'PayPal',
        image: './assets/icons/ic-paypal.png',
        label: 'paypal',
      },
      {
        name: 'Tarjeta de credito',
        image: './assets/icons/ic-tarjeta-credito.png',
        label: 'card-credit',
      },
    ];
    if (this.paymentMethods.length > 0) {
      this.selectedPaymentMethod = this.paymentMethods[0].label;
    }
  }

  ngOnInit(): void {
    this.paypalButtons();
  }

  selectPaymentMethod(index: number) {
    this.selectedPaymentMethod = this.paymentMethods[index].label;
  }

  paypalButtons() {
    paypal
      .Buttons({
        // Call your server to set up the transaction
        createOrder: async (data: any, actions: any) => {
          const amount = 5;

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });

          // const url = `${this.baseUrl}/buy-membership/paid/create-paypal-order`;
          // const token = localStorage.getItem('token');
          // const body = { amount };

          // const requestOptions = {
          //   method: 'POST',
          //   headers: {
          //     Accept: 'application/json, text/plain, */*',
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${token}`,
          //   },
          //   body: JSON.stringify(body),
          // };

          // return await fetch(url, requestOptions)
          //   .then(function (res) {
          //     // console.log(res);
          //     return res.json();
          //   })
          //   .then(function (orderData) {
          //     return orderData.id;
          //   });
        },

        // Call your server to finalize the transaction
        onApprove: async (data: any, actions: any) => {
          try {
            const orderId = data.orderID;
            const url = `${this.baseUrl}/buy-membership/paid/orders-paypal/${orderId}/capture`;
            const token = localStorage.getItem('token');

            const requestOptions = {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            // return await fetch(url, requestOptions)
            //   .then((res) => {
            //     return res.json();
            //   })
            //   .then((dataJson) => {
            //     const orderData = dataJson.data;
            //     console.log('orderData', orderData);
            //     console.log('orderDataDetails', orderData.details);

            //     const errorDetail =
            //       Array.isArray(orderData.details) && orderData.details[0];
            //     if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
            //       return actions.restart(); // Recoverable state, per:
            //     }
            //     if (errorDetail) {
            //       let msg = 'Lo sentimos, su transacción no pudo ser procesada.';
            //       if (errorDetail.description)
            //         msg += '\n\n' + errorDetail.description;
            //       if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
            //       this.alertsService.toast(msg, 'error');
            //       return;
            //       // throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            //     }
            //     // Successful capture! For demo purposes:
            //     console.log(
            //       'Capture result',
            //       orderData,
            //       JSON.stringify(orderData, null, 2)
            //     );
            //     const transaction =
            //       orderData.purchase_units[0].payments.captures[0];

            //     const msg = `¡Transacción completada con éxito! ID de orden: ${transaction.id}`;
            //     this.closeModal();
            //     this.alertsService.toast(msg, 'success');
            //     this.router.navigate(['/dashboard/chats']);
            //   });

            const response = await fetch(url, requestOptions);

            const dataJson = await response.json();
            const orderData = dataJson.data;
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              return actions.restart();
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(
                `${errorDetail.description} (${orderData.debug_id})`
              );
            } else if (!orderData.purchase_units) {
              throw new Error(JSON.stringify(orderData));
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  actions.redirect('thank_you.html');
              const transaction =
                orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

              const msg = `¡Transacción completada con éxito! ID de orden: ${transaction.id}`;
              this.closeModal();
              this.alertsService.toast(msg, 'success');

              this.router.navigate(['/dashboard/chats']);

              console.log(
                'Capture result',
                orderData,
                JSON.stringify(orderData, null, 2)
              );
            }
          } catch (error) {
            console.error(error);
            const msg = `Lo sentimos, su transacción no pudo ser procesada.`;
            this.alertsService.toast(msg, 'error');
          }
        },
      })
      .render(this.paypalButton?.nativeElement);
  }

  closeModal() {
    this.onClose.emit();
  }
}
